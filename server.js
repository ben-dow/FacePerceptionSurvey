const express = require('express');
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();

const AWS = require('aws-sdk');

const app = express();
const port = process.env.PORT || 5000;
const generateUniqueId = require('generate-unique-id');
const _ = require('lodash');
let sequelize = null;

const Serializer = require('sequelize-to-json');

let s3 = new AWS.S3();

const bcrypt = require('bcrypt');
const { ApiGatewayManagementApi } = require('aws-sdk');
const saltRounds = 10;

//Database Connection
if (process.env.NODE_ENV === 'production') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false,
                require: true
            }
        },
        ssl: true
    })
}
else {
    var config = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
    sequelize = new Sequelize(config.database, config.username, config.password,
        {
            port: config.port,
            host: config.host,
            dialect: 'postgres',
            dialectOptions: {
                ssl: {
                    rejectUnauthorized: false,
                    require: true
                }
            },

        })
    var credentials = new AWS.SharedIniFileCredentials();
    AWS.config.credentials = credentials;


}


//Database Definition
const SurveyRespose = sequelize.define('SurveyResponse', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    SurveyVersion: {
        type: DataTypes.DOUBLE,
    },
    startTime: {
        type: DataTypes.DOUBLE,
    },
    endTime: {
        type: DataTypes.DOUBLE,
    },
})

const QuestionResponses = sequelize.define('QuestionResponses', {
    questionResponseID: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    questionNumber: {
        type: DataTypes.INTEGER
    },
    answer: {
        type: DataTypes.JSON
    }
})

const User = sequelize.define('Users', {
    userID: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    currentToken: {
        type: DataTypes.STRING
    },
}, { timestamps: false })

SurveyRespose.hasMany(QuestionResponses)


//API

/** PUBLIC ENDPOINTS **/

//Survey
app.get('/api/survey', (req, res) => {

    getSurveyFile().then((data) => {
        res.json(JSON.parse(data.Body.toString()));
    })
});

function getSurveyFile() {
    const data = s3.getObject({
        Bucket: 'dan-mps-survey',
        Key: 'surveyfiles/questions.json'
    }).promise();

    return data
}

//Images
app.get('/api/asset/:questionNumber/:assetName', (req, res) => {
    var qid = req.params.questionNumber;
    var file = req.params.assetName;

    let params = {
        Bucket: 'dan-mps-survey',
        Key: 'surveyfiles/' + qid + '/' + file
    }

    s3.getObject(params).createReadStream().on('error', error => {
        res.status(500);
    }).pipe(res)
});

//Submit Question Results
app.post(('/api/survey'), jsonParser, (req, res) => {

    const body = req.body;
    const surveyResponseID = generateUniqueId({ length: 8 });

    const surveyResponse = SurveyRespose.create({
        id: surveyResponseID,
        startTime: body.startTime,
        endTime: body.endTime,
        SurveyVersion: body.surveyVersion
    })

    _.forEach(body.responseAnswers, (element) => {
        QuestionResponses.create({
            SurveyResponseId: surveyResponseID,
            questionResponseID: generateUniqueId({ length: 12 }),
            answer: element.answer,
            questionNumber: element.questionNumber
        })
    })

    res.send('Received');
});

/** Authentication */
function tokenExistsOnce(token) {
    return User.count({ where: { currentToken: token } }).then(count => {
        if (count === 1) {
            return true
        }
        return false
    })
}

function checkSignIn(req, res, next) {
    const token = req.query.token;

    if (token) {
        tokenExistsOnce(token).then((exists) => {
            if (exists) {
                next();
            }
            else {
                res.sendStatus(401);
            }
        })
    }

}

//LOGIN
app.post(('/api/login'), jsonParser, (req, res) => {
    const body = req.body

    let username = body.username
    let password = body.password

    let token = generateUniqueId({ length: 32 })

    User.findOne({ where: { username: username, password: password } }).then((user) => {
        user.update({ currentToken: token })
        res.attachment("responses.json");
        res.send({ token: token })
    })

})

//VERIFY TOKEN IS CURRENT
app.post(('/api/verifytoken'), jsonParser, (req, res) => {

    const body = req.body
    let token = body.token

    tokenExistsOnce(token).then((exists) => {
        if (exists) {
            res.sendStatus(200)
        }
        else {
            res.sendStatus(401)
        }
    })

})

/** ADMIN TOOLS **/
app.get(('/api/responses'), [jsonParser, checkSignIn], (req, res) => {
    SurveyRespose.findAll().then((responses) => {
        res.send(Serializer.serializeMany(responses, SurveyRespose));
    })
})
app.get(('/api/responses/:id'), [jsonParser, checkSignIn], (req, res) => {
    SurveyRespose.findOne({ where: { id: req.params.id } }).then((responses) => {
        res.send(responses);
    })
})
app.get(('/api/responses/:id/answers'), [jsonParser, checkSignIn], (req, res) => {
    QuestionResponses.findAll({ where: { SurveyResponseId: req.params.id } }).then((responses) => {
        res.send(Serializer.serializeMany(responses, QuestionResponses));
    })
})

app.get(('/api/responses/:id/answers/:questionNumber'), [jsonParser, checkSignIn], (req, res) => {
    QuestionResponses.findAll({ where: { SurveyResponseId: req.params.id, questionNumber: req.params.questionNumber } }).then((responses) => {
        res.send(Serializer.serializeMany(responses, QuestionResponses));
    })
})

app.get(('/api/answers/:questionNumber'), [jsonParser, checkSignIn], (req, res) => {


    QuestionResponses.findAll({ where: { questionNumber: req.params.questionNumber } }).then((responses) => {
        res.send(Serializer.serializeMany(responses, QuestionResponses));
    })
})

app.get(('/api/donwloadresponses'), [jsonParser, checkSignIn], (req, res) => {

    let response = {}

    SurveyRespose.findAll({ include: [QuestionResponses] }).then((responses) => {
        res.send(JSON.stringify(responses, null, 2))
    }).catch((err)=>{console.log(err)})
})


//Verify All Objects Exist Before Starting

function fetchImageHead(params) {
    return s3.headObject(params).promise();
}

//get the survey

let badFiles = [];
getSurveyFile().then((result) => {
    let questionData = JSON.parse(result.Body.toString());

    _.forEach(questionData.surveyItems, (item) => {
        if (item.type === "question" && item.questionType === "PrioritizeImage") {
            _.forEach(_.get(item, 'Choices'), (choice) => {
                fetchImageHead({
                    Bucket: 'dan-mps-survey',
                    Key: 'surveyfiles/' + item.questionNumber + '/' + choice.assetName
                }).then().catch(() => { console.log("File Not Found: " + item.questionNumber + "/" + choice.assetName) })
            })
        }
    })
}).catch(() => { console.log("Survey File Not Found") })



if (process.env.NODE_ENV === 'production') {

    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));

    // Handle React routing, return all requests to React app
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(port);
console.log("Running and Listening on Port " + port);




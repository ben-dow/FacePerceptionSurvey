import { Button, Container, Grid, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SurveyItem from './SurveyItem';
import Question from './SurveyItems/Question';

var _ = require('lodash');

function Survey(props) {

    const survey = props.survey;
    const [surveyDisplayItems, setSurveyDisplayItems] = useState([])
    const [currentSurveyIndex, setSurveyIndex] = useState(0);
    const [surveyResponse, setSurveyResponse] = useState([]);
    const [startTime, setStartTime] = useState();



    var triggerNextItem = () => {
        setSurveyIndex(currentSurveyIndex => currentSurveyIndex + 1);
    };

    useEffect(() => {
        if (currentSurveyIndex >= surveyDisplayItems.length) {

            //collapse answers to array:
            let formattedSurveyResponse = []
            _.forEach(surveyResponse, function (value, key) {
                formattedSurveyResponse.push({ answer: value.answer, questionNumber: key })
            })

            let answer = {
                surveyVersion: survey.surveyVersion,
                responseAnswers: formattedSurveyResponse,
                startTime: startTime,
                endTime: Date.now()  / 1000
            }

            axios.post('/api/survey', answer, {
                headers: {
                    // Overwrite Axios's automatically set Content-Type
                    'Content-Type': 'application/json'
                }
            });
        }
    }, [currentSurveyIndex])

    var setAnswer = function (questionNumber, answer) {
        setSurveyResponse(surveyResponse => ({ ...surveyResponse, [questionNumber]: { answer: answer } }))
    }

    useEffect(() => { setStartTime(Date.now()  / 1000) }, [])

    if (surveyDisplayItems.length === 0) {
        const tempSurveyItemList = []

        let sortedItems = _.get(survey, 'surveyItems').sort(function (a, b) {
            return (a.displayOrder < b.displayOrder) ? -1 : 1;
        })

        _.forEach(sortedItems, (item) => {
            tempSurveyItemList.push(<SurveyItem triggerNextItem={triggerNextItem} itemData={item} setAnswer={setAnswer} surveyResponse={surveyResponse} />)
        })
        setSurveyDisplayItems(tempSurveyItemList)
    }

    if (currentSurveyIndex < surveyDisplayItems.length && _.get(surveyResponse, "1.answer") !== "no") {
        return (
            <Container>
                {surveyDisplayItems[currentSurveyIndex]}
            </Container>
        )
    }
    else {
        return (
            <Container maxWidth="sm">
            <Grid item>
                    <Typography variant="h4" align={"center"}>
                        End Of Survey
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle2" align={"center"}>
                        Thank you For Your Responses
                    </Typography>
                </Grid>

                <Grid item>
                    <Typography align="center">
                        <a style={{ color: "white" }} href="https://github.com/ben-dow"> Website by Benji</a>
                    </Typography>
                </Grid>
            </Container>
        )
    }

}



export default Survey;

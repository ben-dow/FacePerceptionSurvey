import { Box, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

var _ = require('lodash');

function ResponseViewOfQuestions(props) {

    let { id } = useParams();

    const [responses, setResponses] = useState([])
    const [survey, setSurvey] = useState([])
    const [responseData, setResponseData] = useState({})


    useEffect(() => {
        axios.get('/api/responses/' + id + "/answers", {params: {token: props.token}}).then((response) => { setResponses(_.sortBy(response.data, [function(o) {return o.questionNumber}])); })
        axios.get('/api/survey/').then((response) => { setSurvey(response.data.surveyItems); })
        axios.get('/api/responses/' + id, {params: {token: props.token}}).then((response) => { setResponseData(response.data); })

    }
        , [])

    return (

        <Box
            display="flex"
            height={500}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Box m="auto">
                <Typography variant="h4">
                    Response ID: {id}
                </Typography>
                <Typography variant="h4">
                    Submitted On: {new Date(responseData.createdAt).toLocaleDateString("en-US")}
                </Typography>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Question Number</TableCell>
                                <TableCell>Question Text</TableCell>
                                <TableCell>Response Answer</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {responses.map((row, idx) => {
                                return (<TableRow>
                                    <TableCell>{row.questionNumber}</TableCell>
                                    <TableCell>{_.get(_.find(survey, function (o) { return o.questionNumber === row.questionNumber }), "questionText")}</TableCell>
                                    <TableCell>{JSON.stringify(row.answer, null, 2)}</TableCell>
                                </TableRow>)
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>


    );

}



export default ResponseViewOfQuestions;

import { Box, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

var _ = require('lodash');

function QuestionViewOfResponses(props) {

    let { id } = useParams();

    const [responses, setResponses] = useState([])
    const [survey, setSurvey] = useState([])


    useEffect(() => {
        axios.get('/api/answers/' + id, {params: {token: props.token}}).then((response) => { setResponses(response.data); })
        axios.get('/api/survey/', {params: {token: props.token}}).then((response) => { setSurvey(response.data.surveyItems); })

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
                           Question:  {_.get(_.find(survey, (o) => {return o.type == "question" && o.questionNumber == id}), "questionText")}
                        </Typography>
                        <Typography variant="h5">
                           Question Subtext:  {_.get(_.find(survey, (o) => {return o.type == "question" && o.questionNumber == id}), "questionSubtext")}
                        </Typography>
                        <Typography variant="h5">
                           Number of Responses: {responses.length}
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Response ID</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Answer</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {responses.map((row, idx) => {
                                        return (<TableRow>
                                            <TableCell>{row.SurveyResponseId}</TableCell>
                                            <TableCell>{new Date(row.createdAt).toLocaleDateString("en-US")}</TableCell>
                                            <TableCell>{JSON.stringify(row.answer, null, 2)}</TableCell>
                                            <TableCell><Link component={Button} variant="contained" color="primary" to={"/admin/responses/" + row.SurveyResponseId}>View FUll Response</Link></TableCell>

                                        </TableRow>)
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
 

    );

}



export default QuestionViewOfResponses;

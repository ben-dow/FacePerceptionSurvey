import { Box, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

var _ = require('lodash');

function QuestionView(props) {

    const [survey, setSurvey] = useState([])

    useEffect(() => {
        axios.get('/api/survey').then((response) => { setSurvey(response.data.surveyItems)})}
        , [])

    return (

        <Box
            display="flex"
            height={500}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Box m="auto">
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>QuestionNumber</TableCell>
                                        <TableCell>Question Text</TableCell>
                                        <TableCell>Question Type</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {survey.map((row,idx) => {
                                        if(row.type === "question"){
                                            return(<TableRow>
                                                <TableCell>{row.questionNumber}</TableCell>
                                                <TableCell>{row.questionText}</TableCell>
                                                <TableCell>{row.questionType}</TableCell>
                                                <TableCell><Link to={"/admin/question/" + row.questionNumber} component={Button} color="primary" variant="contained"> View Responses</Link></TableCell>
                                            </TableRow>
                                            )
                                        }
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>


    );

}



export default QuestionView;

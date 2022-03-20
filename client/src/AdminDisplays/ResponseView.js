import { Box, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

var _ = require('lodash');

function ResponseView(props) {

    const [responses, setResponses] = useState([])

    useEffect(() => {
        axios.get('/api/responses', { params: { token: props.token } }).then((response) => { setResponses(response.data) })
    }
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
                                <TableCell>#</TableCell>
                                <TableCell>ResponseID</TableCell>
                                <TableCell>Response Date</TableCell>
                                <TableCell>Survey Version</TableCell>
                                <TableCell>Start Time</TableCell>
                                <TableCell>End Time</TableCell>
                                <TableCell>Total Survey Time (Rounded to Minutes)</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {responses.map((row, idx) => {
                                return (<TableRow>
                                    <TableCell align={"center"}>{idx + 1}</TableCell>
                                    <TableCell align={"center"}>{row.id}</TableCell>
                                    <TableCell align={"center"}>{new Date(row.createdAt).toLocaleDateString("en-US")}</TableCell>
                                    <TableCell align={"center"}>{row.SurveyVersion}</TableCell>
                                    <TableCell align={"center"}>{new Date(row.startTime * 1000).toLocaleTimeString("en-US")}</TableCell>
                                    <TableCell align={"center"}>{new Date(row.endTime * 1000).toLocaleTimeString("en-US")}</TableCell>
                                    <TableCell align={"center"}>{Math.round(((row.endTime) - (row.startTime)) / 60)}</TableCell>
                                    <TableCell><Link component={Button} to={"/admin/responses/" + row.id} color="primary" variant="contained"> View Response </Link></TableCell>
                                </TableRow>)
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>

    );

}



export default ResponseView;

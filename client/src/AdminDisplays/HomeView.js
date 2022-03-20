import { Box, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
var fileDownload = require('js-file-download');

var _ = require('lodash');

function HomeView(props) {


    return (
        <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '90vh'}
        
        }
        >
            <Grid item>
                <Button  variant="contained" color="primary" onClick={()=>{axios.get("/api/donwloadresponses", { params: { token: props.token }}).then((res)=>{console.log(res); fileDownload(JSON.stringify(res.data, null, 2), 'response.json')})}}>Download All Responses as JSON</Button>
            </Grid>
        </Grid>

    );

}



export default HomeView;

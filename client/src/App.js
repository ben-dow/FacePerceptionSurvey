import React, { useState } from 'react';
import Survey from './SurveyDisplays/Survey';
import Grid from '@material-ui/core/Grid'
import { Box, Container, Typography } from '@material-ui/core';

const axios = require('axios');

function App() {

  const [survey, setSurvey] = useState(null);
  const [isFetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  if (!isFetching && survey === null) {
    setFetching(true);
    axios.get('/api/survey').then(function (response) {
      setSurvey(response.data);
    }).finally(() => { setFetching(false) });
  }

  if (isFetching === true) {
    return (
      <div>
        Loading...
      </div>)
  }
  else {
    return (
      <Container maxWidth="md">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
            <Survey survey={survey} />       
        </Box>
      
      </Container>
    );
  }
}

export default App;

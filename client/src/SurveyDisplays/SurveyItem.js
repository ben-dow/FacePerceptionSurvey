import { Box, Button, Container, Grid, Typography } from '@material-ui/core';
import { useState } from 'react';
import Information from './SurveyItems/Information';
import Question from './SurveyItems/Question';
var _ = require('lodash');

function SurveyItem(props) {

    const itemData = props.itemData;
    const triggerNextItem = props.triggerNextItem;
    const setAnswer = props.setAnswer;
    const [displayNextButton, setDisplayNextButton] = useState(false)

    let ItemDisplay = null;



    if(_.get(itemData, 'type') === "question"){
        ItemDisplay = <Question itemData = {itemData} setAnswer={setAnswer} setDisplayNextButton={setDisplayNextButton} surveyResponse={props.surveyResponse} />
    } else if(_.get(itemData, 'type') === "information"){
        ItemDisplay = <Information itemData = {itemData} setDisplayNextButton={setDisplayNextButton}/>
    }

    return (
        <Container>
            <Box display="flex">
                {ItemDisplay}
            </Box>

                <Typography variant="subtitle2" component="p" align={"center"}>
                    {(displayNextButton ? <Button onClick={()=>{triggerNextItem(); setDisplayNextButton(false)}} variant={"contained"} color="primary">Next</Button> : null)}
                </Typography>

        </Container>
    )
}

export default SurveyItem;

import { Box, Container, Grid, Typography } from "@material-ui/core";
import TextQuestion from "./QuestionTypes/TextQuestion";
import ImagePrioritizationQuestion from "./QuestionTypes/ImagePrioritizationQuestion";
import MultipleChoiceQuestion from "./QuestionTypes/MultipleChoiceQuestion";

const _ = require("lodash")
function Question(props) {

    const itemData = props.itemData
    const setAnswer = props.setAnswer
    const setDisplayNextButton = props.setDisplayNextButton

    let QuestionAnswerDisplay = null;
    let questionType = _.get(itemData, 'questionType')

    if (questionType === "PrioritizeImage") {
        QuestionAnswerDisplay = <ImagePrioritizationQuestion  itemData = {itemData} setAnswer={setAnswer} setDisplayNextButton={setDisplayNextButton} surveyResponse={props.surveyResponse}/>
    }
    else if (questionType === "Text") {
        QuestionAnswerDisplay = <TextQuestion itemData = {itemData} setAnswer={setAnswer} setDisplayNextButton={setDisplayNextButton}  surveyResponse={props.surveyResponse}/>
    }
    else if (questionType === "MultipleChoice") {
        QuestionAnswerDisplay = <MultipleChoiceQuestion itemData = {itemData} setAnswer={setAnswer} setDisplayNextButton={setDisplayNextButton} surveyResponse={props.surveyResponse}/>

    }



    return (
        <Container>
            <Grid item>
                <Typography variant="h4" align={"center"}>
                    {_.get(itemData, 'questionText')}
                </Typography>
            </Grid>
            <Grid item >
                <Typography variant="subtitle2" align={"center"}>
                    {_.get(itemData, 'questionSubtext')}
                </Typography>
            </Grid>
            
            <Grid item>
            <Box  display="flex" justifyContent={"center"} >
                {QuestionAnswerDisplay}
            </Box>
            </Grid>
           


        </Container>
    )
}

export default Question;

import { Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@material-ui/core";
import React, { useEffect, useState } from 'react';
const _ = require('lodash');


class MultipleChoiceQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null
        }
        this.setMultipleChoiceAnswer = this.setMultipleChoiceAnswer.bind(this);
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.value !== null) {
            this.props.setDisplayNextButton(true)
            this.props.setAnswer(this.props.itemData.questionNumber, this.state.value)
        }
        if (prevProps.itemData.questionNumber != this.props.itemData.questionNumber) {
            this.setState({
                value: null
            })
        }
    }

    setMultipleChoiceAnswer(val) {
        this.setState({
            value: val
        })
    }

    render() {

        return (
            <Container>
    
                <FormControl component="fieldset">
                    <RadioGroup name="gender1" value={this.state.value} onChange={(e) => { this.setMultipleChoiceAnswer(e.target.value) }}>
                        {_.get(this.props.itemData, 'Choices').map((item) => {
                            return <FormControlLabel key={item.choiceIdentifier} value={item.choiceIdentifier} control={<Radio />} label={item.text} />
                        })}

                    </RadioGroup>
                </FormControl>
            </Container>
        )
    }

}

/*
function MultipleChoiceQuestion(props) {
    const [value, setValue] = useState(null);
    const itemData =  props.itemData;
    const setAnswer = props.setAnswer;
    const setDisplayNextButton = props.setDisplayNextButton;

    useEffect(() =>
    
    {setAnswer(itemData.questionNumber, value) 
    if(value != null) {
        setDisplayNextButton(true);
    }

    },[value])


    return (
        <FormControl component="fieldset">
            <RadioGroup name="gender1" value={value} onChange={(e) => {setValue(e.target.value)}}>
                {_.get(itemData, 'Choices').map((item) => {
                   return <FormControlLabel key={item.choiceIdentifier} value={item.choiceIdentifier} control={<Radio />} label={item.text} />
                })}

            </RadioGroup>
        </FormControl>
    )
}
*/

export default MultipleChoiceQuestion;
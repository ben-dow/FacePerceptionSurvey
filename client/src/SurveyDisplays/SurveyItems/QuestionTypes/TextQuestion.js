import { Box, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";


class TextQuestion extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      textAnswer: ""
    }

    this.setTextAnswer = this.setTextAnswer.bind(this);
  }

  setTextAnswer(val) {
    this.setState({ textAnswer: val})
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.state.textAnswer != ""){
      this.props.setDisplayNextButton(true);
    }

    if(this.state.textAnswer === ""){
      this.props.setDisplayNextButton(false);
    }

    if(prevProps.itemData.questionNumber != this.props.itemData.questionNumber){
      this.setState({
          textAnswer : ""
      })
  }

    this.props.setAnswer(this.props.itemData.questionNumber, this.state.textAnswer)
  }

  render() {
    return (
      <div>
        <Box
          display="flex"
          width={500} height={80}>
          <Box m="auto">
            <TextField value={this.state.textAnswer} onChange={(e) => {this.setTextAnswer(e.target.value) }} style={{ width: 400 }} color="secondary" align="center" id="outlined-basic" label="Enter Your Answer Here" variant="outlined" />
          </Box>
        </Box>
      </div>
    )
  }
}


export default TextQuestion;

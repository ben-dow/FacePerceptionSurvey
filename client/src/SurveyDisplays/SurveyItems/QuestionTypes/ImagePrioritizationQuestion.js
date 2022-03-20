import { Box, Button, GridList, GridListTile, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';



var _ = require('lodash');

const useStyles = makeStyles({
    imageUnselected: {
        width: 150,
        height: 176,
        "background-color": "#275f8a",
        '&:hover': {
            "opacity": "0.5"
        }
    },
    imageSelected: {
        width: 150,
        height: 176,
        "background-color": "#616d75",
    },
});

class ImagePrioritizationQuestion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedImages: []
        }

        this.selectImage = this.selectImage.bind(this)
        this.removeLastItem = this.removeLastItem.bind(this)

    }

    selectImage(identifier) {
        if (!_.includes(this.state.selectedImages, identifier)) {
            let imageList = this.state.selectedImages;
            imageList = [...imageList, identifier]
            this.setState({ ...this.state, selectedImages: imageList })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.selectedImages.length === this.props.itemData.Choices.length) {
            this.props.setDisplayNextButton(true);
            this.props.setAnswer(this.props.itemData.questionNumber, this.state.selectedImages);
        }

        if(this.state.selectedImages.length !== this.props.itemData.Choices.length){
            this.props.setDisplayNextButton(false);
        }

        if (prevProps.itemData.questionNumber != this.props.itemData.questionNumber) {
            this.props.setDisplayNextButton(false);

            this.setState({
                selectedImages: []
            })
        }
    }


    removeLastItem() {

        if (this.state.selectedImages.length > 1) {
            this.setState({
                selectedImages: _.chunk(this.state.selectedImages, this.state.selectedImages.length - 1)[0]
            })
        }
        else {
            this.setState({
                selectedImages: []

            })
        }

    }

    render() {
        return (<div >

            <Box
                display="flex"
                justifyContent="center"
                width={500} height={75}
            >
                <Box m="auto"><Button variant="contained" color="primary" onClick={() => { this.removeLastItem() }}>Undo</Button></Box>
            </Box>
            <Box
                display="flex"
                justifyContent="center"
                width={500} height={550}
            >
                <Box m="auto" >
                    <GridList cellHeight={"auto"} cellHeight={176} cols={3} spacing={5}>
                        {_.get(this.props.itemData, 'Choices').map((tile) => (
                            <GridListTile onClick={() => { this.selectImage(tile.choiceIdentifier) }} cols={1} key={tile.choiceIdentifier}>
                                <PrioritizeImage questionNumber={this.props.itemData.questionNumber} choiceData={tile} id={tile.choiceIdentifier} isSelected={_.includes(this.state.selectedImages, tile.choiceIdentifier)} />
                            </GridListTile>
                        ))}
                    </GridList>
                </Box>
            </Box>


        </div>)
    }
}


function PrioritizeImage(props) {
    const classes = useStyles();

    if (!props.isSelected) {
        return (
            <img className={classes.imageUnselected} onClick={() => { }} src={"api/asset/" + props.questionNumber + "/" + props.choiceData.assetName}></img>
        )
    }
    else {
        return (<div className={classes.imageSelected}>
            <Typography variant="h3" align="center">
                {props.id}
            </Typography>

        </div>)
    }
}

export default ImagePrioritizationQuestion;
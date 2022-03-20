import { Grid, Typography } from "@material-ui/core";
import { useEffect } from "react";
import ReactMarkdown from 'react-markdown'

const  _  = require('lodash');

function Information(props) {

    const itemData = props.itemData

    useEffect(() => {
        props.setDisplayNextButton(true)
      });

    return (
        <div>
            <Grid item>
                <Typography variant="h4" align={"center"}>
                    <ReactMarkdown>
                        {_.get(itemData, 'text')}
                    </ReactMarkdown>
                </Typography>
            </Grid>
            <Grid item>
                <ReactMarkdown>
                    {_.get(itemData, 'descriptionText')}
                </ReactMarkdown>
            </Grid>
        </div>
    )
}

export default Information;

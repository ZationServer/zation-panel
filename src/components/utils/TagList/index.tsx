/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from "react";
import {Chip, Grid, Stack} from "@mui/material";
import classes from "./index.module.css";

const TagList: React.FC<{ tags: [string, string?][], className?: string }> =
    ({tags, className}) => {
        return <Grid container direction="row" className={className} spacing={1.2}>
            {tags.map(([key, value]) =>
                <Grid item key={key + (value ?? "")}>
                    <Chip
                          className={classes.chip}
                          label={key + (value != null ? `: ${value}` : "")}
                          color="primary"
                          variant="outlined"
                    />
                </Grid>)}
        </Grid>
    }

export default TagList;
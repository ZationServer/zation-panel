/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from "react";
import {Grid} from "@mui/material";
import classes from "./index.module.css";

const IconInfoItem: React.FC<{
    icon: React.ReactElement,
    title: string,
    subTitle: string
}> = ({title,subTitle,icon}) => {
    return (
        <Grid container spacing={1}>
            <Grid item className={classes.iconContainer}>
                {icon}
            </Grid>
            <Grid item>
                <Grid container direction={"column"} className={classes.textContainer}>
                    <Grid item className={classes.title}>
                        {title}
                    </Grid>
                    <Grid item className={classes.subTitle}>
                        {subTitle}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default IconInfoItem
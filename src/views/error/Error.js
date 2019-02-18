import React, {Component} from 'react';
import RCenter from 'react-center';
import './Error.css';
import Fab from "@material-ui/core/es/Fab/Fab";
import {Refresh, Warning} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import PathTool from "../../core/PathTool";

const styles = theme => ({
    fab: {
        margin: theme.spacing.unit
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
});

class Error extends Component
{
    render() {
        const { classes } = this.props;
        return (
            <div className="App transition-item detail-page darkTheme">
                <RCenter className={"fullHeight"}>
                    <div className={'ErrorContainer'}>
                        <Warning className={'warningIcon bounceInDown animated'}/>
                        <h1>{this.props.message}</h1>
                        <Fab variant="extended" aria-label="Delete" onClick={this.reload} className={'btn '+classes.fab}>
                            <Refresh className={classes.extendedIcon} />
                            Try again
                        </Fab>
                    </div>
                </RCenter>
            </div>
        );
    }

    // noinspection JSMethodCanBeStatic
    reload() {
        window.location.pathname = PathTool.mainPath;
    }
}

export default withStyles(styles)(Error);


import React, {Component} from 'react';
import RCenter from "react-center";
import {ClipLoader, ScaleLoader} from "react-spinners";
import BigBarCardInfo from "../../../components/infoCard/BigBarCardInfo";
import {load} from 'zation-client';
import Fab from "@material-ui/core/es/Fab/Fab";
import {withStyles} from "@material-ui/core";
import './ping.css';

const styles = theme => ({
    fab: {
        margin: theme.spacing.unit
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
});

class Ping extends Component {

    constructor(props){
        super(props);

        this.state = {
            mode : 'load',
            btnLoad : false
        }
    }

    render() {
        const { classes } = this.props;
        const {mode} = this.state;
        if(mode === 'load') {
            return (
                <div className="container-fluid">
                    <div className="animated fadeIn">
                        <RCenter className={"fullHeight loaderDown"}>
                            <ScaleLoader
                                heightUnit={"em"}
                                widthUnit={"em"}
                                height={7}
                                width={0.6}
                                color={'#3099bb'}
                            />
                        </RCenter>
                    </div>
                </div>
            )
        }
        else if(mode === 'result')
        {
            return (
                <div className="container-fluid">
                    <div className="animated fadeIn">
                        <BigBarCardInfo postFix={"ms"} label={this.state.label}
                                        description="Average ping time"
                                        data={this.state.data} value={this.state.avg + " ms"}
                                        redraw={true}
                        />
                    </div>
                    <div className={'btnContainer pingBtn-co'}>
                        <Fab variant="extended" aria-label="Delete" onClick={this.refresh.bind(this)} className={'btn loginBtn '+classes.fab}>
                            {!this.state.btnLoad ? "Refresh" : <ClipLoader color={'white'}/>}
                        </Fab>
                    </div>
                </div>
            )
        }
    }

    refresh() {
        this.setState({btnLoad : true});
        this.process.bind(this)();
    }

    componentDidMount() {
        this._isMount = true;
        if(this.state.mode === 'load') {
           this.process.bind(this)();
        }
    }

    process(){
        (async () => {
            const client = load();

            const label = [];
            const data = [];

            for(let i = 1; i < 21; i++) {
                label.push("Ping " + i);
                data.push(await client.ping());
            }

            const sum = data.reduce(function(a, b) { return a + b; });

            this.setState({
                label : label,
                avg : Number(sum / data.length).toFixed(2),
                mode : 'result',
                data : data,
                btnLoad : false
            });

        })();
    }

    componentWillUnmount() {
        this._isMount = false;
    }

    setState(params) {
        if (this._isMount) {
            super.setState(params);
        }
    }


}

export default withStyles(styles)(Ping);

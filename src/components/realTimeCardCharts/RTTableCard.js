import React, {Component} from 'react';
import MaterialTable from 'material-table'
import RTInfoCard from "../infoCard/RTInfoCard";
import "./rtTableCard.css";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    overrides: {
        MuiPaper: {
            root: {
                top: '-1rem !important',
                boxShadow: 'none !important',
                backgroundColor: 'transparent !important'
            }
        },
        MuiTableCell : {
            root : {
                color: 'white !important',
                fontFamily: "NexaBold",
                padding: '4px 16px 4px 24px'
            }
        },
        MuiTableSortLabel : {
            root : {
                '&:hover' : {
                    color: 'rgba(43, 225, 98,1.0) !important'
                },
                '&:focus' : {
                    color: 'rgba(43, 225, 98,1.0) !important'
                }
            },
            active : {
                color: 'rgba(43, 225, 98,1.0) !important'
            }
        },
        MuiIconButton : {
            label : {
                '&:focus' : {
                    outline : 'none'
                }
            }
        }
    }
});

class RTTableCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isRunning : true,
            data : this.props.getData()
        };
    }

    render() {
        return (
            <div className={"tableCard"}>
            <RTInfoCard value={this.props.value} big={true} minHeight={'29rem'} green={true} onTimeChange={this.timeChange.bind(this)}>
                <div className="chart-wrapper mx-3 table-con">
                    <MuiThemeProvider theme={theme}>
                    <MaterialTable actions={this.props.actions} columns={this.props.columns} data={this.state.data} title={""}
                        options={{
                            paging: false,
                            toolbar: false
                        }} headerStyle={{backgroundColor : 'black'}}
                    />
                    </MuiThemeProvider>
                </div>
            </RTInfoCard>
            </div>
        )
    }

    timeChange(state){
        if(!state && this.state.isRunning){
            clearInterval(this.state.interval);
            this.setState({isRunning : false});
        }

        if(state && !this.state.isRunning){
            this.process.bind(this)();
            this.componentDidMount.bind(this)();
        }
    }

    componentDidMount() {

        const interval = setInterval(() => {
            this.process.bind(this)();

        },this.props.every || 1000);

        this.setState({interval : interval,isRunning : true})
    }

    process()
    {
        this.setState({
           data : this.props.getData()
        });
    }

    componentWillUnmount() {
        if(this.state.interval){
            clearInterval(this.state.interval);
        }
    }
}

export default RTTableCard;
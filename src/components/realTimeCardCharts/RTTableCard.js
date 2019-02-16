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
                top: '-5rem !important',
                boxShadow: 'none !important',
                backgroundColor: 'transparent !important'
            }
        },
        MuiTableCell : {
            root : {
                color: 'white !important',
                fontFamily: "NexaBold"
            }
        },
        MuiTableSortLabel : {
            root : {
                '&:hover' : {
                    color: 'rgba(43, 225, 98,1.0) !important'
                }
            },
            active : {
                color: 'rgba(43, 225, 98,1.0) !important'
            }
        }
    }
});

class RTTableCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data : this.props.getData()
        };
    }

    render() {
        return (
            <RTInfoCard value={this.props.value} big={true} height={'29rem'} green={true}>
                <div className="chart-wrapper mx-3" style={{ height: '300px'}}>
                    <MuiThemeProvider theme={theme}>
                    <MaterialTable columns={this.props.columns} data={this.state.data} title={""}
                        options={{
                            paging: false,
                            toolbar: false
                        }} headerStyle={{backgroundColor : 'black'}}
                    />
                    </MuiThemeProvider>
                </div>
            </RTInfoCard>
        )
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
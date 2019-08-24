import React, {Component} from 'react';
import {create, save, load, ConnectionAbortError} from "zation-client";
import {devMode} from "./mode";
import Loading from "./views/loading/Loading";
import Login from "./views/login/Login";
import MainPanel from "./views/panel/main/MainPanel";
import Error from "./views/error/Error";
import DataEngine from "./core/DataEngine";
import PingEngine from "./core/PingEngine";
import PathTool from "./core/PathTool";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mode : 'start',
            errorMessage : ''
        };
    }

    render() {
        if(this.state.mode === 'start' || this.state.mode === 'loadPanel') {
            return <Loading app={this}/>
        }
        else if(this.state.mode === 'auth'){
            return <Login app={this}/>
        }
        else if(this.state.mode === 'panel') {
            return <MainPanel app={this}/>
        }
        else if(this.state.mode === 'error'){
            return <Error app={this} message={this.state.errorMessage}/>;
        }
    }

    async loadPanel() {
        this.setState({mode : 'loadPanel'});

        const client = load();

        await client.subPanelOutCh();

        //connect to dataEngine and create
        DataEngine.getEngine().connect();

        await client.pubPanelInCh('firstPing',{});

        //wait 3000 ms for worker can respond
        setTimeout(() => {

            //create ping interval (worker know that panel is still in use)
            PingEngine.startPing();

            this.setState({mode : 'panel'});
        },3000);
    }

    toAuth() {
        if(this.state.mode === 'start') {
            setTimeout(() => {
                this.setState({mode : 'auth'});
            },1500);
        }
        else{
            this.setState({mode : 'auth'});
        }
    }

    setError(msg){
        if(this.state.mode === 'start') {
            setTimeout(() => {
                this.setState({mode : 'error', errorMessage : msg});
            },1500);
        }
        else{
            this.setState({mode : 'error', errorMessage : msg});
        }
    }

    componentDidMount() {
        this._isMount = true;
        if(this.state.mode === 'start') {
            (async () => {
                const client = create(!devMode ? {
                    hostname : window.location.hostname,
                    port :  parseInt(window.location.port),
                    secure : (window.location.protocol === 'https:'),
                    rejectUnauthorized : false,
                    debug : false
                } : {port : 3001,debug : true});
                save(client);

                client.eventReact().onDisconnect(() => {
                    setTimeout(()=> {
                        if(!client.isConnected()) {
                            this.setError('The connection to the server is lost.');
                        }
                    },5000)
                });

                client.eventReact().onServerDeauthenticate(() => {
                    this.toAuth();
                });

                try {
                    await client.connect();

                    if( client.getSocket().getAuthToken() !== null &&
                        client.getPlainToken().panelAccess &&
                        client.getTokenVariable('ZATION-PANEL-USER-NAME')
                    ) {
                        (async () => {
                            await this.loadPanel();
                        })();
                    }
                    else {
                        this.toAuth();
                    }

                }
                catch (e) {
                    if(e instanceof ConnectionAbortError) {
                        this.setError('Could not connect to the server.');
                    }
                    else {
                        this.setError('Unknown error occurred');
                    }
                }

            })();
        }
    }

    componentWillMount() {
        if(devMode){
            if(window.location.pathname !== '/') {
                window.location.pathname = '';
            }
        }
        else {
            if(PathTool.isNotMainPath(window.location.pathname)) {
                window.location.pathname = PathTool.getMainPath(window.location.pathname);
            }
            PathTool.mainPath = PathTool.getMainPath(window.location.pathname);
        }
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

export default App;

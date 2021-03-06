import React, {Component} from 'react';
import logo from '../../../assets/image/zationLogo.svg';
import {Navbar} from 'react-bootstrap';
import './MainPanel.css';
import Sidebar from "../../../components/sidebar/Sidebar";
import DataEngine from "../../../core/DataEngine";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import Server from "../servers/Server";
import Button from "react-bootstrap/Button";
import avatar from './../../../assets/image/user.svg';
import {client} from 'zation-client';
import Ping from "../ping/Ping";
import Clients from "../clients/Clients";
import Chart from 'chart.js';
import ServerDetail from "../servers/ServerDetail";
import {devMode} from "../../../mode";
import PathTool from "../../../core/PathTool";

Chart.defaults.global.animation.duration = 1000;
//Chart.defaults.global.animation.easing = 'easeInQuad';

class MainPanel extends Component {

    constructor(props) {
        super(props);

        try {
            const payload = client.tokenPayload;
            this.state = {name: payload != null ? payload['ZATION-PANEL-USER-NAME'] : 'Unknown'};

            DataEngine.getEngine().setTaskProcessClusterInfo();
            DataEngine.getEngine().processClusterInfo();
        }
        catch (e) {
            this.state = {name: 'Unknown name'};
        }
    }

    render() {
        return (
            <Router>
                <div className="App transition-item detail-page sidebar-lg-show sidebar-fixed">
                    <header className="app-header">
                        <Navbar className={"navbar"} bg="dark" variant="dark">
                            <Button className="navbar-toggler sidebar-toggler d-lg-none mr-auto"
                                    onClick={this.switchSidebar.bind(this)}>

                            <span className="navbar-toggler-icon">
                            </span>
                            </Button>
                            <Navbar.Brand href="#home" className="sm-auto logoCo">
                                <img
                                    alt=""
                                    src={logo}
                                    width="30"
                                    height="30"
                                    className="d-inline-block align-top"
                                />
                                {' Zation'}
                            </Navbar.Brand>
                            <div className="profile">
                            <span className="name">
                                {this.state.name}
                                </span>
                                <li className="nav-item dropdown account-switch">
                                    <a className="nav-link nav-link" href="/" onClick={this.switchAccountDropDown.bind(this)}>
                                        <img src={avatar} alt={'user'} width="30" height="30" className="account-switch"/>
                                    </a>
                                    <div id="account-dropdown-menu"
                                         className="dropdown-menu dropdown-menu-right animated fadeIn account-switch">
                                        <div className="dropdown-header text-center account-switch">
                                            <strong className="account-switch">
                                                Account
                                            </strong>
                                        </div>
                                        <div className="dropdown-item account-switch" onClick={this.logout.bind(this)}>
                                            <i className="fa fa-lock"/>
                                            Logout
                                        </div>
                                    </div>
                                </li>
                            </div>
                        </Navbar>
                    </header>
                    <Sidebar/>
                    <main className="main">
                        <Route exact path={PathTool.mainPath+"/"} component={Dashboard}/>
                        <Route exact path={PathTool.mainPath+"/ping"} component={Ping}/>
                        <Route exact path={PathTool.mainPath+"/clients"} component={Clients}/>
                        <Route exact path={PathTool.mainPath+"/server"} component={Server}/>
                        <Route exact path={PathTool.mainPath+"/server/:id"} component={ServerDetail}/>
                    </main>
                </div>
            </Router>
        )
    }

    componentDidMount() {
        document.getElementsByTagName('body')[0].addEventListener('click',(event) => {
            this.offAccountDropDown(event);
        });
    }

    // noinspection JSMethodCanBeStatic
    switchSidebar() {
        document.getElementsByTagName('body')[0].classList.toggle('sidebar-show');
    }

    // noinspection JSMethodCanBeStatic
    switchAccountDropDown(event) {
        event.preventDefault();
        document.getElementById('account-dropdown-menu').classList.toggle('show');
    }

    // noinspection JSMethodCanBeStatic
    offAccountDropDown(event) {
        if(!event.target.classList.contains('account-switch')) {
            const accountDropdown = document.getElementById('account-dropdown-menu');
            if (accountDropdown && accountDropdown.classList.contains('show')) {
                accountDropdown.classList.remove('show');
            }
        }
    }

    // noinspection JSMethodCanBeStatic
    async logout() {
        try{
            await client.deauthenticate();
        }
        catch (e) {}
        if(devMode){
            window.location.pathname = '';
        }
        else{
            window.location.pathname = PathTool.getMainPath(window.location.pathname);
        }

    }

}

export default MainPanel;

import React, {Component} from 'react';
import logo from '../../../assets/image/zationLogo.svg';
import {Navbar} from 'react-bootstrap';
import './MainPanel.css';
import Sidebar from "../../../components/sidebar/Sidebar";
import DataEngine from "../../../core/DataEngine";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import Servers from "../servers/Servers";
import Button from "react-bootstrap/es/Button";
import avatar from './../../../assets/image/user.svg';
import {load} from 'zation-client';
import Ping from "../ping/Ping";
import Clients from "../clients/Clients";
import Chart from 'chart.js';

Chart.defaults.global.animation.duration = 1000;
//Chart.defaults.global.animation.easing = 'easeInQuad';

class MainPanel extends Component {

    constructor(props) {
        super(props);

        try {
            this.state = {name: load().getTokenVariable('ZATION-PANEL-USER-NAME')};

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
                            <Navbar.Brand href="#home" className="sm-auto">
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
                        <Route exact path="/" component={Dashboard}/>
                        <Route exact path="/ping" component={Ping}/>
                        <Route exact path="/clients" component={Clients}/>
                        <Route exact path="/server" component={Servers}/>
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
            const client = load();
            await client.deauthenticate();
        }
        catch (e) {}
        window.location.pathname = '';
    }

}

export default MainPanel;

import React, {Component} from 'react';
import logo from '../../../assets/image/zationLogo.svg';
import {Navbar} from 'react-bootstrap';
import './MainPanel.css';
import Sidebar from "../../../components/sidebar/Sidebar";
import DataEngine from "../../../core/DataEngine";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import Servers from "../servers/Servers";

class MainPanel extends Component {
    render() {
        return (
            <Router>
            <div className="App transition-item detail-page sidebar-lg-show">
                <header className="App-header">
                    <Navbar bg="dark" variant="dark">
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
                    </Navbar>
                </header>
                <Sidebar/>
                <main className="main">
                    <Route exact path="/" component={Dashboard} />
                    <Route exact path="/server" component={Servers} />
                </main>
            </div>
            </Router>
        )
    }

    componentDidMount() {
        console.log(DataEngine.getEngine().storage);
        console.log(DataEngine.getEngine().panelAuthUserMap);
        console.log(DataEngine.getEngine().defaultUserName);
        console.log(DataEngine.getEngine().workerCount);
        console.log(DataEngine.getEngine().instanceCount);

        DataEngine.getEngine().processClusterInfo();
        console.log(DataEngine.getEngine().clusterInfoStorage);
    }
}

export default MainPanel;

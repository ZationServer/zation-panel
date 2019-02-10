import React, {Component} from 'react';
import logo from '../../../assets/image/zationLogo.svg';
import {Navbar} from 'react-bootstrap';
import { SideNav, Nav } from 'react-sidenav'
import './MainPanel.css';
import {Icon} from "@blueprintjs/core";
import { FaServer } from 'react-icons/fa';
import Sidebar from "../../../components/sidebar/sidebar";

class MainPanel extends Component {
    render() {
        return (
            <div className="App transition-item detail-page sidebar-lg-show">
                <header className="App-header">
                    <Navbar bg="dark" variant="dark">
                        <Navbar.Brand href="#home">
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
            </div>
        )
    }
}

export default MainPanel;

import React, {Component} from 'react';
import logo from '../../../assets/image/zationLogo.svg';
import {Navbar} from 'react-bootstrap';
import { SideNav, Nav } from 'react-sidenav'
import './MainPanel.css';
import {Icon} from "@blueprintjs/core";
import { FaServer } from 'react-icons/fa';

class MainPanel extends Component {
    render() {
        return (
            <div className="App transition-item detail-page">
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
                    <SideNav defaultSelectedPath="1">
                        <Nav id="1">
                            <Icon icon={FaServer()}/>
                            Item 1
                        </Nav>
                    </SideNav>
                </header>
            </div>
        )
    }
}

export default MainPanel;

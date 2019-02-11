import React, {Component} from 'react';
import './sidebar.css';
import { FaTachometerAlt, FaServer, FaUser, FaStopwatch} from 'react-icons/fa';
import { NavLink } from "react-router-dom";


class Sidebar extends Component {
    render() {
        return (
            <div className="sidebar ps--active-y ps">
                <div className="scrollbar-container sidebar-nav ps ps-container ps--active-y">
                    <ul className="nav">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link" ria-current="page" exact={true} activeClassName="active">
                                <FaTachometerAlt className="nav-icon"/>
                                Dashboard</NavLink>
                        </li>
                        <li className="nav-title">Details</li>
                        <li className="nav-item">
                            <NavLink to="/server" className="nav-link" ria-current="page" activeClassName="active">
                                <FaServer className="nav-icon"/>
                                Server</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/user" className="nav-link" ria-current="page" activeClassName="active">
                                <FaUser className="nav-icon"/>
                                User</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/ping" className="nav-link" ria-current="page" activeClassName="active">
                                <FaStopwatch className="nav-icon"/>
                                Ping</NavLink>
                        </li>
                    </ul>
                </div>
                <button className="sidebar-minimizer mt-auto" onClick={this.miniSidebar.bind(this)} type="button">
                </button>
            </div>
        )
    }

    miniSidebar(){
        const body = document.getElementsByTagName('body')[0];
        const sideBar = document.getElementsByClassName('sidebar')[0];

        body.classList.toggle('brand-minimized');
        body.classList.toggle('sidebar-minimized');

        sideBar.classList.toggle('ps--active-y');
        sideBar.classList.toggle('ps');
    }
}

export default Sidebar;

import React, {Component} from 'react';
import './sidebar.css';
import { FaTachometerAlt, FaServer, FaUser, FaStopwatch} from 'react-icons/fa';
import { NavLink } from "react-router-dom";


class Sidebar extends Component {
    render() {
        return (
            <div className="sidebar">
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
                <button className="sidebar-minimizer mt-auto" type="button">
                </button>
            </div>
        )
    }
}

export default Sidebar;

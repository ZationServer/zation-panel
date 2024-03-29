/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React, {useRef} from 'react';
import './index.css';
import { FaTachometerAlt, FaServer, FaUser} from 'react-icons/fa';
import { RiFileList2Line } from 'react-icons/ri';
import { NavLink } from "react-router-dom";
import GridContent from "../../utils/horizontalContent";
import {Typography} from "@mui/material";

const Sidebar: React.FC<{onNavigationClick?: () => void}> = ({onNavigationClick = () => {}}) => {

    const sidebarRef = useRef<HTMLDivElement>(null);

    const minimize = () => {
        const sidebar = sidebarRef.current;
        if(!sidebar) return;
        const body = document.getElementsByTagName('body')[0];

        body.classList.toggle('brand-minimized');
        body.classList.toggle('sidebar-minimized');
        sidebar.classList.toggle('ps--active-y');
        sidebar.classList.toggle('ps');
    }

    const navLinkClassNamesDetermine = ({isActive}: {isActive: boolean}) => {
        return `${isActive ? 'active ' : ''}nav-link`;
    }

    return (
        <div ref={sidebarRef} className="sidebar ps--active-y ps">
            <div className="scrollbar-container sidebar-nav ps ps-container ps--active-y">
                <ul className="nav">
                    <li className="nav-item">
                        <NavLink to={"/"} onClick={onNavigationClick} ria-current="page" end className={navLinkClassNamesDetermine}>
                            <GridContent className="nav-item-content">
                                <FaTachometerAlt className="nav-item-icon"/>
                                <Typography className={"nav-item-title"}>Overview</Typography>
                            </GridContent>
                        </NavLink>
                    </li>
                    <li className="nav-title">Details</li>
                    <li className="nav-item">
                        <NavLink to={"/servers"} onClick={onNavigationClick} ria-current="page" className={navLinkClassNamesDetermine}>
                            <GridContent className="nav-item-content">
                                <FaServer className="nav-item-icon"/>
                                <Typography className={"nav-item-title"}>Servers</Typography>
                            </GridContent>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to={"/clients"} onClick={onNavigationClick} ria-current="page" className={navLinkClassNamesDetermine}>
                            <GridContent className="nav-item-content">
                                <FaUser className="nav-item-icon"/>
                                <Typography className={"nav-item-title"}>Clients</Typography>
                            </GridContent>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to={"/liveLogs"} onClick={onNavigationClick} ria-current="page" className={navLinkClassNamesDetermine}>
                            <GridContent className="nav-item-content">
                                <RiFileList2Line className="nav-item-icon"/>
                                <Typography className={"nav-item-title"}>Live logs</Typography>
                            </GridContent>
                        </NavLink>
                    </li>
                </ul>
            </div>
            <button className="sidebar-minimizer mt-auto" onClick={minimize} type="button">
            </button>
        </div>
    )
}

export default Sidebar;
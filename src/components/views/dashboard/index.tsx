import React from 'react';
import logo from '../../../assets/image/zationLogo.svg';
import './index.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {Logout} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '../../lib/sidebar';
import useClient from "../../../lib/hooks/useClient";
import useUsername from '../../../lib/hooks/useUsername';
import {
    AppBar,
    Avatar, Box, Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography
} from "@mui/material";
import Home from "./sides/home";
import LiveLogs from "./sides/liveLogs";
import Clients from "./sides/clients";
import Server from "./sides/servers";
import NotFound from "./sides/notFound";

const Dashboard: React.FC = () => {
    const client = useClient();
    const username = useUsername();

    const [accMenuAnchor, setAccMenuAnchor] = React.useState<HTMLElement | null>(null);

    const logout = () => client.deauthenticate();
    const toggleSidebar = () => {
        document.getElementsByTagName('body')[0].classList.toggle('sidebar-show');
    }
    const openAccMenu = (event: any) => {
        setAccMenuAnchor(event.currentTarget);
    }
    const closeAccMenu = () => {
        setAccMenuAnchor(null);
    }

    return (
        <div id="dashboard" className="sidebar-lg-show sidebar-fixed fadeIn animated">
            <Router>
                <AppBar position="sticky" className={"navbar"}>
                    <Toolbar>
                        <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{mr: 2}}
                                onClick={toggleSidebar}
                            >
                                <MenuIcon/>
                            </IconButton>
                        </Box>
                        <div className="brand">
                            <div className="brand-icon">
                                <img
                                    alt=""
                                    src={logo}
                                    className="d-inline-block align-top"
                                />
                            </div>
                            <Typography className={"brand-title"}>{"Zation"}</Typography>
                        </div>
                        <div>
                            <IconButton
                                onClick={openAccMenu}
                                size="small"
                                sx={{ml: 2}}
                                aria-controls={accMenuAnchor != null ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={accMenuAnchor != null ? 'true' : undefined}
                            >
                                <Avatar className="avatar"/>
                            </IconButton>
                            <Menu
                                anchorEl={accMenuAnchor}
                                open={Boolean(accMenuAnchor)}
                                onClose={closeAccMenu}
                                classes={{
                                    paper: 'account-menu',
                                    root: 'account-menu',
                                }}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem disabled classes={{root: 'account-menu-header'}}>
                                    <ListItemIcon>
                                        {username.length > 0 ?
                                            <Avatar sx={{width: 25, height: 25}}>{username[0].toUpperCase()}</Avatar> :
                                            <Avatar/>}
                                    </ListItemIcon>
                                    <ListItemText>{username}</ListItemText>
                                </MenuItem>
                                <Divider/>
                                <MenuItem onClick={logout}>
                                    <ListItemIcon>
                                        <Logout fontSize="small"/>
                                    </ListItemIcon>
                                    <ListItemText>Logout</ListItemText>
                                </MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
                <Sidebar/>
                <main className="main">
                    <Routes>
                        <Route path={"/"} element={<Home/>}/>
                        <Route path={"/liveLogs"} element={<LiveLogs/>}/>
                        <Route path={"/clients"} element={<Clients/>}/>
                        <Route path={"/servers"} element={<Server/>}/>
                        <Route path={"/servers/:id"} element={<></>}/>
                        <Route path={"*"} element={<NotFound/>}/>
                    </Routes>
                </main>
            </Router>
        </div>
    );
};

export default Dashboard;
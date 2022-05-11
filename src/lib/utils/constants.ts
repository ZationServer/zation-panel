/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

export const DEV = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const PATH = window.location.pathname;
const parsedRootPanelPath = (PATH.substring(0,(PATH.lastIndexOf('/panel')+6))
    .replace(/(\/)+$/,'')) || "/";
export const ROOT_PANEL_PATH = parsedRootPanelPath === '' ? '/' : parsedRootPanelPath;

export const SERVER_PATH = PATH.substring(0,PATH.indexOf("/panel")) || "/";
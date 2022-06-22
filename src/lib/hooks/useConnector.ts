/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from "react";
import Connector from "../core/connector";

export const ConnectorContext = React.createContext<Connector | null>(null);

export default function useConnector(): Connector {
    const manager = React.useContext(ConnectorContext);
    if(!manager) throw new Error("Connector context is not available");
    return manager;
}
import React, {useEffect} from "react";
import Connector from "../core/connector";
import { useForceUpdate } from "./useForceReload";

export const ConnectorContext = React.createContext<Connector | null>(null);

export default function useConnector(): Connector {
    const manager = React.useContext(ConnectorContext);
    if(!manager) throw new Error("Connector context is not available");
    return manager;
}
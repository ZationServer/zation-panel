/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from "react";
import {Client} from "zation-client";
import {PanelAPIDefinition} from "../definitions/apiDefinition";

export const ClientContext = React.createContext<Client<PanelAPIDefinition> | null>(null);

export default function useClient(): Client<PanelAPIDefinition> {
    const client = React.useContext(ClientContext);
    if(!client) throw new Error("Client context is not available");
    return client;
}
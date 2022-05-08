import React from "react";
import {Client} from "zation-client";
import {APIDefinition} from "../definitions/apiDefinition";

export const ClientContext = React.createContext<Client<APIDefinition> | null>(null);

export default function useClient(): Client<APIDefinition> {
    const client = React.useContext(ClientContext);
    if(!client) throw new Error("Client context is not available");
    return client;
}
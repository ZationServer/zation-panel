/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import useClient from "./lib/hooks/useClient";
import {ConnectAbortError, TimeoutError} from "zation-client";
import useConnector from './lib/hooks/useConnector';
import {wait} from "./lib/utils/wait";
import {Loading} from "./components/views/loading";
import ErrorView from "./components/views/error";
import Login from "./components/views/login";
import Dashboard from "./components/views/dashboard";

enum AppState {
    Loading,
    Authentication,
    Panel
}

function App() {

    const client = useClient();
    const connector = useConnector();
    const [state,setState] = useState(AppState.Loading);
    const stateRef = useRef<AppState>();
    const [error,setError] = useState<Error | null>(null);
    stateRef.current = state;

    const loadPanel = useCallback(async () => {
        setState(AppState.Loading);
        await connector.connect(client);
        //wait 3000ms so that servers can respond
        setTimeout(() => setState(AppState.Panel),3000);
    },[client,connector]);

    useEffect(() => {
        client.onDisconnect(() => {
            setTimeout(()=> {
                if(!client.connected) setError(new Error('The connection to the server is lost.'));
            },5000);
        });

        client.onDeauthenticate(async (_,self) => {
            setState(AppState.Authentication);
        });

        (async () => {
            try {
                await client.connect();
                if(client.authToken?.panelAccess && client.authTokenPayload?.['PANEL_USER_NAME'] != null)
                    await loadPanel();
                else {
                    await wait(2000);
                    setState(AppState.Authentication);
                }
            }
            catch (err) {
                await wait(2000);
                if(err instanceof ConnectAbortError || err instanceof TimeoutError)
                    setError(new Error("Could not connect to the servers."));
                else setError(new Error("Unknown error occurred"));
            }
        })();
    },[client,loadPanel]);
    return (
        <div className="view-root">
            {error ? <ErrorView message={error.message}/> :
                state === AppState.Loading ? <Loading/> :
                    state === AppState.Panel ? <Dashboard/> :
                        <Login onSuccessLogin={loadPanel}/>}
        </div>
    )
}

export default App;

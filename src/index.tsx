/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from 'react';

import './lib/loader/chartjsLoader';

import ReactDOM from 'react-dom';
import './index.scss';
import './assets/libs/animate.css';
import './assets/libs/all.min.css';
import './assets/libs/materialIcons.css';
import App from './app';
import reportWebVitals from './reportWebVitals';
import {ClientContext} from "./lib/hooks/useClient";
import {Client} from "zation-client";
import {APIDefinition} from "./lib/definitions/apiDefinition";
import {DEV, SERVER_PATH} from "./lib/utils/constants";
import {ConnectorContext} from "./lib/hooks/useConnector";
import Connector from "./lib/core/connector";

ReactDOM.render(
  <React.StrictMode>
      <ClientContext.Provider value={new Client<APIDefinition>(!DEV ? {
          hostname: window.location.hostname,
          port:  parseInt(window.location.port),
          path: SERVER_PATH,
          secure: (window.location.protocol === 'https:'),
          rejectUnauthorized: false,
          debug: false
      } : {port: 4001,debug: true},true)}>
          <ConnectorContext.Provider value={new Connector()}>
              <App/>
          </ConnectorContext.Provider>
      </ClientContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

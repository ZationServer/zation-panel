/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import LicenseInformation from "./licenseInformation";
import UsersInformation from "./usersInformation";
import ResourceUsageInformation from "./resourceUsageInformation";
import GeneralSystemInfo from "./generalSystemInfo";

export const enum ServerType {
    Worker = 0,
    Broker = 1,
    State = 2
}

interface BasicStaticServerInformation extends GeneralSystemInfo {
    id: string,
    readonly type: ServerType,
    port: number,
    path: string,
    tls: boolean,
    nodeVersion: string,
    ip: string,
    serverVersion: string,
    launchedTimestamp: number,
}

export interface StaticWorkerInformation extends BasicStaticServerInformation {
    readonly type: ServerType.Worker,
    hostname: string,
    appName: string,
    tags: [string,string?][],
    debug: boolean,
    scaling: boolean,
    license?: LicenseInformation,
    panelAuthUserMap: Record<string,string>,
    defaultUserName: string
}

export interface StaticBrokerInformation extends BasicStaticServerInformation {
    readonly type: ServerType.Broker
}

export interface StaticStateInformation extends BasicStaticServerInformation {
    readonly type: ServerType.State
}

interface BasicDynamicServerInformation {
    id: string,
    clientCount: number,
    resourceUsage: ResourceUsageInformation,
    httpMessageCount: number,
    wsMessageCount: number,
    invokeMessageCount: number,
    transmitMessageCount: number,
}

export interface DynamicWorkerInformation extends BasicDynamicServerInformation {
    leader?: boolean,
    connectedToState: boolean,
    users: UsersInformation,
    brokers: string[]
}

export interface DynamicBrokerInformation extends BasicDynamicServerInformation {
    connectedToState: boolean
}

export interface DynamicStateInformation extends BasicDynamicServerInformation {}

export interface LocalExtractedServerInformation {
    name: string
}

export type WorkerInformation = StaticWorkerInformation & DynamicWorkerInformation;
export type BrokerInformation = StaticBrokerInformation & DynamicBrokerInformation;
export type StateInformation = StaticStateInformation & DynamicStateInformation;

export type DynamicServerInformation = DynamicWorkerInformation | DynamicBrokerInformation | DynamicStateInformation;
export type ServerInformation = WorkerInformation | BrokerInformation | StateInformation;

export type ProcessedWorkerInformation = WorkerInformation & LocalExtractedServerInformation;
export type ProcessedBrokerInformation = BrokerInformation & LocalExtractedServerInformation;
export type ProcessedStateInformation = StateInformation & LocalExtractedServerInformation;

export type ProcessedServerInformation = ProcessedWorkerInformation | ProcessedBrokerInformation | ProcessedStateInformation;
/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import { ServerType } from "../definitions/serverInformation";

export function formatServerType(type: ServerType): string {
  switch (type) {
    case ServerType.Worker:
      return "Worker";
    case ServerType.Broker:
      return "Broker";
    case ServerType.State:
      return "State";
    default:
      return "Unknown";
  }
}

/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import useClient from "./useClient";

export default function useUsername(): string {
    const client = useClient();
    return client.authTokenPayload?.['PANEL_USER_NAME'] ?? 'Unknown';
}
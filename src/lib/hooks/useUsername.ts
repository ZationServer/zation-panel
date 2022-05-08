import useClient from "./useClient";

export default function useUsername(): string {
    const client = useClient();
    return client.authTokenPayload?.['PANEL_USER_NAME'] ?? 'Unknown';
}
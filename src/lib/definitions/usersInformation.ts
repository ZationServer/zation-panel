export default interface UsersInformation {
    panelUserCount: number,
    defaultUserGroupCount: number,
    authUserGroupsCounts: Record<string,number>
}
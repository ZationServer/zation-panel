/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from "react";
import useConnector from "../../../../../../lib/hooks/useConnector";
import RTPieChartCard from "../../../core/rtPieChartCard";
import {capitalizeFirstLetter} from "../../../../../../lib/utils/string";

const UserGroupsStats: React.FC<{
    interval?: number,
    mini?: boolean,
}> = ({interval = 1000,mini}) => {
    const connector = useConnector();

    return <RTPieChartCard
        interval={interval}
        mini={mini}
        description={"User groups"}
        valueTitle={(data) => Object.keys(data).length.toString()}
        fetchValues={() => {
            const res = {
                [capitalizeFirstLetter(connector.defaultUserGroupName)]: connector.clusterSummary.users.defaultUserGroupCount,
                ["Panel user"]: connector.clusterSummary.users.panelUserCount,
            };
            const authUserGroupsCount = connector.clusterSummary.users.authUserGroupsCounts;
            for(const group in authUserGroupsCount) {
                if(!authUserGroupsCount.hasOwnProperty(group)) continue;
                res[capitalizeFirstLetter(connector.panelAuthUserMap[group] ?? group)] =
                    authUserGroupsCount[group];
            }
            return res;
        }}
    />
};

export default UserGroupsStats;
import React, {Component} from 'react';
import BigRealTimeCard from "../../../components/RealTimeCard/BigRealTimeCard";
import DataEngine from "../../../core/DataEngine";

class User extends Component {

    render() {
        return (
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <BigRealTimeCard redraw={true} getValue={(v) => {return v[0]}}
                                     getData={User.getClientCount} maxLength={40} every={1000}
                                     getDataLabel={User.getClientsConnectedDesc} getDescription={User.getClientsConnectedDesc}
                    />
                </div>
            </div>
        )
    }

    static getClientsConnectedDesc(v) {
        return (v > 1 || v === 0) ? "Clients connected" : "Client connected";
    }

    static getClientCount() {
        return [DataEngine.getEngine().clusterInfoStorage.clientCount];
    }

}

export default User;

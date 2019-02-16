import React, {Component} from 'react';
import BigRealTimeCard from "../../../components/realTimeCardCharts/BigRealTimeCard";
import DataEngine from "../../../core/DataEngine";

class Servers extends Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-sm-6 col-lg-6">
                            <BigRealTimeCard legend={false} description="Cpu usage" getData={Servers.getCpuUsage} maxLength={20}
                                             every={1000} postFix={"%"} label={["Cpu usage"]}/>
                        </div>
                        <div className="col-sm-6 col-lg-6">
                            <BigRealTimeCard legend={false} label={"Memory usage"} description="Memory usage" getData={Servers.getMemoryUsage}
                                             every={2000}  maxLength={10} postFix={"mb"} getValue={Servers.getMemoryUsagePercent}/>
                        </div>
                    </div>
                    <div className="row">
                    </div>
                </div>
            </div>
        )
    }

    static getCpuUsage() {
        return [Number(DataEngine.getEngine().clusterInfoStorage.cpu).toFixed(1)];
    }

    static getMemoryUsage() {
        return [Number(DataEngine.getEngine().clusterInfoStorage.memory.usedMemMb).toFixed(1)];
    }

    static getMemoryUsagePercent(current)
    {
        return Number((current / DataEngine.getEngine().clusterInfoStorage.memory.totalMemMb) * 100).toFixed(1) + ' %';
    }

}

export default Servers;

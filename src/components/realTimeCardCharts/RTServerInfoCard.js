import React, {Component} from 'react';
import RTInfoCard from "../infoCard/RTInfoCard";
import DataEngine from "../../core/DataEngine";
import "./rtServerInfoCard.css";
import Time from "../../core/Time";
import ObjTool from "../../core/ObjTool";

class RTServerInfoCard extends Component {

    constructor(props) {
        super(props);

        this.id = props.id;
        this.dataEngine = DataEngine.getEngine();

        this.state = {
            isRunning : true,
            data : this.process()
        };
    }

    render() {
        const {data} = this.state;
        return (
            <div className={"tableCard main-font"}>
                <RTInfoCard value={"Server Details"} big={true} height={'29rem'} onTimeChange={this.timeChange.bind(this)}>
                    <div className="chart-wrapper mx-3 table-con">
                        <div className={"container-fluid"}>
                            <div className={"row"}>
                                <div className="col-sm-6 col-lg-6 font1">
                                    <p><span id="blue-f">{`Instance id    :`}</span>&#32;{data.id}</p>
                                    <p><span id="blue-f">{`Zation Server Version :`}</span>&#32;{data.zationServerVersion}</p>
                                    <p><span id="blue-f">{`Node Version   :`}</span>&#32;{data.nodeVersion}</p>
                                    <p><span id="blue-f">{`Platform       :`}</span>&#32;{data.platform}</p>
                                    <p><span id="blue-f">{`OOS            :`}</span>&#32;{data.oos}</p>
                                    <p><span id="blue-f">{`CPU            :`}</span>&#32;{data.cpu}</p>
                                    <p><span id="blue-f">{`License        :`}</span>&#32;{data.license}</p>
                                    <p><span id="blue-f">{`License Type   :`}</span>&#32;{data.licenseType}</p>
                                    <p><span id="blue-f">{`Leader         :`}</span>&#32;{data.leader}</p>
                                    <p><span id="blue-f">{`Worker         :`}</span>&#32;{data.worker}</p>
                                    <p><span id="blue-f">{`Broker         :`}</span>&#32;{data.broker}</p>
                                </div>
                                <div className="col-sm-6 col-lg-6 font1">
                                    <p><span id="blue-f">{`Started        :`}</span>&#32;{data.startedTime}</p>
                                    <p><span id="blue-f">{`IP Address     :`}</span>&#32;{data.ip}</p>
                                    <p><span id="blue-f">{`Hostname       :`}</span>&#32;{data.hostname}</p>
                                    <p><span id="blue-f">{`Port           :`}</span>&#32;{data.port}</p>
                                    <p><span id="blue-f">{`Path           :`}</span>&#32;{data.path}</p>
                                    <p><span id="blue-f">{`Post Key       :`}</span>&#32;{data.postKey}</p>
                                    <p><span id="blue-f">{`App Name       :`}</span>&#32;{data.appName}</p>
                                    <p><span id="blue-f">{`Secure         :`}</span>&#32;{data.secure}</p>
                                    <p><span id="blue-f">{`Debug          :`}</span>&#32;{data.debug}</p>
                                    <p><span id="blue-f">{`WsEngine       :`}</span>&#32;{data.wsEngine}</p>
                                    <p><span id="blue-f">{`Drive Usage    :`}</span>&#32;{data.driveUsage}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </RTInfoCard>
            </div>
        )
    }

    process()
    {
        const data = {};
        const instance = this.dataEngine.storage[this.id];
        if(instance){
            data.id = this.id;
            data.ip = instance.ip;
            data.hostname = instance.hostname;
            data.port = instance.port;
            data.path = instance.path;
            data.postKey = instance.postKey;
            data.secure = instance.secure ? 'yes' : 'no';
            data.leader = instance.master.isLeader ? 'yes' : 'no';
            data.startedTime = Time.processDate(instance.serverStartedTimestamp);
            data.worker = ObjTool.countKeys(instance.workers);
            data.broker = ObjTool.countKeys(instance.brokers);
            data.oos = instance.oos;
            data.cpu = instance.cpuModel;
            data.appName = instance.appName;
            data.platform = instance.platform;
            data.debug = instance.debug ? 'yes' : 'no';
            data.wsEngine = instance.wsEngine;
            data.nodeVersion = instance.nodeVersion;
            data.zationServerVersion = instance.zationServerVersion;
            if(instance.drive){
                data.driveUsage = instance.drive.usedPercentage + ' %';
            }
            else{
                data.driveUsage = 'Unknown';
            }

            const license = instance.license;

            if(license){
                data.license = `Licensed to ${license.h} (${license.l}) (Id: ${license.i})`;
                data.licenseType = `${license.t} License (${license.mi === -1 ? 'Unlimited instances' : 
                    `Max ${license.mi} instance${license.mi > 1 ? 's' : ''}`})`;
            }
            else {
                data.license = 'No license (only for testing)';
                data.licenseType = '/';
            }
        }
        return data;
    }

    timeChange(state){
        if(!state && this.state.isRunning){
            clearInterval(this.state.interval);
            this.setState({isRunning : false});
        }

        if(state && !this.state.isRunning){
            this.process.bind(this)();
            this.componentDidMount.bind(this)();
        }
    }

    componentDidMount() {

        const interval = setInterval(() => {
            this.setState({
                data : this.process()
            });

        },this.props.every || 1000);

        this.setState({interval : interval,isRunning : true})
    }

    componentWillUnmount() {
        if(this.state.interval){
            clearInterval(this.state.interval);
        }
    }
}

export default RTServerInfoCard;
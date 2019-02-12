import React, {Component} from 'react';
import RCenter from "react-center";

class Servers extends Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <RCenter className={"fullHeight loaderDown"}>
                        <h1 style={{color : 'white'}}>This feature is available soon</h1>
                    </RCenter>
                </div>
            </div>
        )
    }

}

export default Servers;

import React, {Component} from 'react';

export class CameraZoom extends Component {
    constructor(props) {
        super(props);
        props.sigma.cameras[0].goTo({ x: 0, y: 0, angle: 0, ratio: 1.3 });
    }

    render() {
        return <div/>
    }
}

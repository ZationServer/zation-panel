import React, {Component} from 'react';
import './Loading.css';
import { ScaleLoader} from 'react-spinners';
import RCenter from 'react-center';

export default class Loading extends Component
{
    render() {
        return (
            <div className="App transition-item detail-page darkTheme">
                <RCenter className={"fullHeight"}>
                    <ScaleLoader
                        heightUnit={"em"}
                        widthUnit={"em"}
                        height={7}
                        width={0.6}
                        color={'#3099bb'}
                    />
                </RCenter>
            </div>
        );
    }

}


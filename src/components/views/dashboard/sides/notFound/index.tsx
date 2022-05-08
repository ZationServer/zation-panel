import React from 'react';
import Center from "../../../../utils/center";
import {ReactComponent as NotFoundImg} from './../../../../../assets/image/notFound.svg';
import classes from "./index.module.css";

const NotFound: React.FC = () => {
    return (
        <div className="container-fluid">
            <Center className={"full-height fadeIn animated"}>
                <NotFoundImg className={classes.notFoundImg}/>
            </Center>
        </div>
    )
};

export default React.memo(NotFound);
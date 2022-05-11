/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from 'react';
import {ScaleLoader} from 'react-spinners';
import Center from "../../utils/center";

export const Loading = () => {
    return (
        <Center className={"full-height fadeIn animated"}>
            <ScaleLoader
                height={"7em"}
                width={"0.6em"}
                color={'var(--primary-color)'}
            />
        </Center>
    );
};

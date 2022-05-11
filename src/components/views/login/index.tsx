/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React, {KeyboardEventHandler, useRef, useState} from 'react';
import './index.css'
import {ReactComponent as Logo} from '../../../assets/image/zationLogoWithBackground.svg'
import {ClipLoader} from 'react-spinners';
import Center from "../../utils/center";
import {Fab} from "@mui/material";
import useClient from "../../../lib/hooks/useClient";
import {reAddClassName} from "../../../lib/utils/className";

const Login: React.FC<{
    onSuccessLogin?: () => void;
}> = ({onSuccessLogin}) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const client = useClient();

    const usernameRef = useRef<HTMLInputElement>(null);
    const usernameContainerRef = useRef<HTMLDivElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordContainerRef = useRef<HTMLDivElement>(null);
    const loginContainerRef = useRef<HTMLDivElement>(null);

    const authenticate = async () => {

        if (loading) return;
        const username = usernameRef.current?.value ?? '';
        const password = passwordRef.current?.value ?? '';

        let valid = true;
        if (username.length === 0) {
            valid = false;
            reAddClassName(usernameContainerRef.current,'shake');
        }
        if (password.length === 0) {
            valid = false;
            reAddClassName(passwordContainerRef.current,'shake');
        }
        if (error) {
            reAddClassName(usernameContainerRef.current,'shake');
            reAddClassName(passwordContainerRef.current,'shake');
            valid = false;
        }

        if (valid) {
            setLoading(true);
            try {
                await client.request('#panel/auth', {username, password});
                loginContainerRef.current?.classList.add('fadeOut');
                setTimeout(async () => {
                    setLoading(false);
                    if (onSuccessLogin) onSuccessLogin();
                }, 500);
            } catch (_) {
                setError(true);
                setLoading(false);
                reAddClassName(usernameContainerRef.current,'shake');
                reAddClassName(passwordContainerRef.current,'shake');
            }
        }
    };

    const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.key === 'Enter') authenticate();
    }

    const resetErrorState = () => {
        setError(false);
    }

    return (
        <Center className={"full-height"}>
            <div ref={loginContainerRef} className={'container fadeIn animated'}>
                <div className={'logoContainer'}>
                    <Logo className={'logo'}/>
                    <h1 className={'title'}>Welcome</h1>
                </div>
                <div className={'form'}>
                    <div ref={usernameContainerRef}
                         className={"wrap-input validate-input animated " + (error ? 'wrap-input-error' : '')}
                         data-validate="Enter username">
                        <input onChange={resetErrorState} ref={usernameRef} onKeyPress={handleKeyPress}
                               className="input" type="text" name="username" placeholder="Username"/>
                        <span className="focus-input focus-input-user"/>
                    </div>
                    <div ref={passwordContainerRef}
                         className={"wrap-input validate-input animated " + (error ? 'wrap-input-error' : '')}
                         data-validate="Enter password">
                        <input onChange={resetErrorState} ref={passwordRef} onKeyPress={handleKeyPress}
                               className="input" type="password" name="username" placeholder="Password"/>
                        <span className="focus-input focus-input-lock"/>
                    </div>
                </div>
                <div className={'btnContainer'}>
                    <Fab disabled={loading} variant="extended" aria-label="Delete" onClick={authenticate}
                         className="btn loginBtn">
                        {!loading ? "Login" : <ClipLoader color={'white'}/>}
                    </Fab>
                </div>
            </div>
        </Center>
    );
};

export default Login;

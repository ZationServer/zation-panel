import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import RCenter from "react-center";
import './Login.css'
import Logo from './../../assets/image/zation-logo.svg'
import Fab from "@material-ui/core/es/Fab/Fab";
import {load} from "zation-client";
import {ClipLoader} from 'react-spinners';

const styles = theme => ({
    fab: {
        margin: theme.spacing.unit
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
});

const shake = (id) => {
    document.getElementById(id).classList.remove('shake');
    setTimeout(() => {
        document.getElementById(id).classList.add('shake');
    },10);
};

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading : false,
            error : false
        };
    }

    render() {
        const { classes } = this.props;
        const {error} = this.state;
        return (
            <div className="App transition-item detail-page darkTheme">
                <RCenter className={"fullHeight"}>
                    <div id="login-co" className={'loginContainer fadeIn animated'}>
                    <div className={'logoContainer'}>
                        <img src={Logo} alt={"Zation Logo"} width={'110em'} height={'110em'} className={'logo'}/>
                        <h1 className={'logoText'}>LOG IN</h1>
                    </div>
                        <div className={'form'}>
                            <div id="username-co" className={"wrap-input100 validate-input animated " + (error ? 'wrap-input-error' : '')} data-validate="Enter username">
                                <input onChange={() => {this.setState({error : false})}} id="username" onKeyPress={this._handleKeyPress.bind(this)}
                                       className="input100" type="text" name="username" placeholder="Username"/>
                                    <span className="focus-input100 focus-input-user"/>
                            </div>
                            <div id="password-co" className={"wrap-input100 validate-input animated "  + (error ? 'wrap-input-error' : '')} data-validate="Enter password">
                                <input onChange={() => {this.setState({error : false})}} id="password" onKeyPress={this._handleKeyPress.bind(this)}
                                       className="input100" type="password" name="username" placeholder="Password"/>
                                <span className="focus-input100 focus-input-lock"/>
                            </div>
                        </div>
                        <div className={'btnContainer'}>
                            <Fab disabled={this.state.loading} variant="extended" aria-label="Delete" onClick={this.login.bind(this)} className={'btn loginBtn '+classes.fab}>
                                {!this.state.loading ? "Login" : <ClipLoader color={'white'}/>}
                            </Fab>
                        </div>
                    </div>
                </RCenter>
            </div>
        );
    }

    _handleKeyPress = async (e) => {
        if (e.key === 'Enter') {
            await this.login();
        }
    };

    async login() {

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        let isOk = true;

        if(username.length === 0){
            isOk = false;
            shake('username-co');
        }
        if(password.length === 0){
            isOk = false;
            shake('password-co');
        }

        if(this.state.error){
            shake('username-co');
            shake('password-co');
            isOk = false;
        }

        if(isOk){

            this.setState({loading : true});

            const client = load();

            await client.request()
                .systemController(true)
                .controller('zation/panel/auth')
                .data({username : username, password : password})
                .onSuccessful(() => {
                    document.getElementById('login-co').classList.add('fadeOut');
                    setTimeout(() => {
                        this.props.app.loadPanel();
                    },500);
                })
                .onError(() => {
                    this.setState({error : true});
                    shake('username-co');
                    shake('password-co');
                })
                .send();

            this.setState({loading : false});
        }
    }

}

export default withStyles(styles)(Login);


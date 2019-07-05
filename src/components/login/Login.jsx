import React, { Component } from 'react';
import axios from 'axios';
import { render } from './../../';
import './Login.scss';

class Login extends Component {
    constructor () {
        super();
        this.state = {
            username: null,
            password: null,
            error: null
        };
    }

    async loginButtonClicked () {
        const { username, password } = this.state;
        if (!username || !password) {
            this.setState({
                error: 'You need to enter a username and password.'
            })
            return;
        }
        const response = await axios.post('/user/authenticate', { username, password }).catch(e => e.response);
        if (response.status === 403) {
            // Stay here, login failed
            this.setState({
                error: response.data.message
            });
        } else if (response.status === 500) {
            this.setState({
                error: 'Our servers seem to be experiencing some problems at the moment, try again later'
            });
        } else {
            // Authenticated, remove login page
            render();
            localStorage.setItem('token', response.data.token)
        }
    }

    render () {
        return (
            <div className='poplet-root login-container row animated fadeIn'>  
                <div className='col s12 offset-s2'>
                    <div className='login-header'>
                        <h1>Login to Poplet</h1>
                        <h4 className='login-header-error'>{this.state.error}</h4>
                    </div>
                    <form id='login' className='col s6'>
                        <div className='username-container'>
                            <div class='input-field col s12'>
                                <input onChange={(e) => this.setState({ username: e.target.value })} id='username' type='text' class='validate'></input>
                                <label htmlFor='username'>Username</label>
                            </div>
                        </div>
                        <div className='password-container'>
                            <div className='input-field col s12'>
                                <input onChange={(e) => this.setState({ password: e.target.value })} id='password' type='password' className='validate'></input>
                                <label htmlFor='password'>Password</label>
                            </div>
                        </div>
                    </form>
                    <button className='btn login-button' onClick={() => this.loginButtonClicked()}>Submit</button>
                </div>
            </div>
        )
    }
}

export default Login;
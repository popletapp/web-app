import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.scss';
import { Messages } from '../../i18n';

class Login extends Component {
  constructor () {
    super();
    this.state = {
      email: null,
      password: null,
      error: null
    };
    if (localStorage.getItem('token')) {
      window.location.replace('/home')
    }
  }

  async loginButtonClicked (event) {
    event.preventDefault();
    const { email, password } = this.state;
    if (!email || !password) {
      this.setState({
        error: Messages.LOGIN_EMAIL_PASSWORD_MISSING
      });
      return;
    }
    let response = await axios.post('/users/authenticate', { email, password }).catch(e => e.response);
    if (!response) {
      response = { status: 500 }
    }

    if (response.status === 403) {
      // Stay here, login failed
      this.setState({
        error: response.data.message
      });
    } else if (response.status === 500) {
      this.setState({
        error: Messages.LOGIN_ERROR
      });
    } else {
      // Authenticated, remove login page
      localStorage.setItem('token', response.data.token);
      window.location.replace('/home');
    }
  }

  render () {
    return (
      <div className='authentication-page-container'>
        <section className='cinematic-authentication'></section>
        <div className='authentication-container animated fadeIn'>
          <div className='authentication'>
            <div className='authentication-header'>
              <h1>{Messages.LOGIN_LOG_IN_TO_POPLET}</h1>
              <h4 className='authentication-header-error'>{this.state.error}</h4>
            </div>
            <form onSubmit={(e) => this.loginButtonClicked(e)} id='login' className='login-form'>
              <div className='username-container'>
                <label htmlFor='email'>{Messages.EMAIL}</label>
                <input onInput={(e) => this.setState({ email: e.target.value })}
                  id='email' type='text' className={`text-input ${this.state.error && this.state.errorOccured === 'email' ? 'invalid-text-input' : ''}`} />
              </div>

              <div className='password-container'>
                <label htmlFor='password'>{Messages.PASSWORD}</label>
                <div className='password-component'>
                  <input onInput={(e) => this.setState({ password: e.target.value || '' })}
                    id='username' type='password' className='text-input'></input>
                </div>
              </div>
              <button className='btn login-button' type='submit'>{Messages.SUBMIT}</button>
            </form>

            <div className='no-account'>
              {Messages.LOGIN_NO_ACCOUNT_BODY_1} <Link className='no-account-link' to='/signup'>{Messages.SIGN_UP}</Link> {Messages.LOGIN_NO_ACCOUNT_BODY_2}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;

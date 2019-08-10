import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.scss';

class Login extends Component {
  constructor () {
    super();
    this.state = {
      email: null,
      password: null,
      error: null
    };
  }

  async loginButtonClicked (event) {
    event.preventDefault();
    const { email, password } = this.state;
    if (!email || !password) {
      this.setState({
        error: 'You need to enter an e-mail and password.'
      });
      return;
    }
    const response = await axios.post('/users/authenticate', { email, password }).catch(e => e.response);
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
              <h1>Login to Poplet</h1>
              <h4 className='authentication-header-error'>{this.state.error}</h4>
            </div>
            <form onSubmit={(e) => this.loginButtonClicked(e)} id='login' className='login-form'>
              <div className='username-container'>
                <label htmlFor='email'>E-mail</label>
                <input onInput={(e) => this.setState({ email: e.target.value })}
                  id='email' type='text' className={`text-input ${this.state.error && this.state.errorOccured === 'email' ? 'invalid-text-input' : ''}`} />
              </div>

              <div className='password-container'>
                <label htmlFor='password'>Password</label>
                <div className='password-component'>
                  <input onInput={(e) => this.setState({ password: e.target.value || '' })}
                    id='username' type='password' className='text-input'></input>
                </div>
              </div>
              <button className='btn login-button' type='submit'>Submit</button>
            </form>

            <div className='no-account'>
              Don't have an account? <Link className='no-account-link' to='/signup'>Sign up</Link> today for free!
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;

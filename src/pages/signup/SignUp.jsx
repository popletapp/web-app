import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SignUp.scss';

class SignUp extends Component {
  constructor () {
    super();
    this.state = {
      username: null,
      password: null,
      error: null,
      errorOccured: null,
      securityStatus: {},
      passwordsDontMatch: null
    };
  }

  checkSecurity () {
    const { password: input } = this.state;
    if (input) {
      let containsUppercase = false;
      let containsNumber = false;
      let containsSpecialChar = false;
      let isAtleastTwelveChars = false;

      if (input.toUpperCase() !== input) {
        containsUppercase = true;
      }
      if (/\d/.test(input)) {
        containsNumber = true;
      }
      if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(input)) { // eslint-disable-line no-useless-escape
        containsSpecialChar = true;
      }
      if (input.length > 11) {
        isAtleastTwelveChars = true;
      }

      switch ([containsUppercase, containsNumber, containsSpecialChar, isAtleastTwelveChars].filter(Boolean).length) {
        case 1:
          this.setState({ securityStatus: { text: 'Fair', color: '#fbc02d' } });
          break;
        case 2:
          this.setState({ securityStatus: { text: 'Good', color: '#c0ca33' } });
          break;
        case 3:
          this.setState({ securityStatus: { text: 'Very Good', color: '#4caf50' } });
          break;
        case 4:
          this.setState({ securityStatus: { text: 'Strong', color: '#29b6f6' } });
          break;
        default:
          this.setState({ securityStatus: { text: 'Weak', color: '#e53935' } });
      }
    } else {
      this.setState({ securityStatus: { text: 'Weak', color: '#e53935' } });
    }
  }

  checkIfSame (compare) {
    const { password } = this.state;

    if (password === compare) {
      this.setState({ passwordsDontMatch: false });
      return true;
    } else {
      this.setState({ passwordsDontMatch: true });
      return false;
    }
  }

  checkUsername () {
    const { username } = this.state;

    if (username.length < 3) {
      this.setState({ error: 'Username needs to be at least 4 characters', errorOccured: 'username' });
    } else if (username.length > 32) {
      this.setState({ error: 'Username can\'t be longer than 32 characters', errorOccured: 'username' });
    } else if (/\W/.test(username)) {
      this.setState({ error: 'Username can only contain alphanumeric characters or underscores', errorOccured: 'username' });
    } else {
      this.setState({ error: null, errorOccured: null });
    }
  }

  checkEmail () {
    const REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
    const { email } = this.state;
    if (!REGEX.test(email)) {
      this.setState({ error: 'E-mail address is invalid', errorOccured: 'email' });
    } else {
      this.setState({ error: null, errorOccured: null });
    }
  }

  async signupButtonClicked () {
    const { username, password, email, passwordsDontMatch } = this.state;
    if (!username || !password) {
      return this.setState({
        error: 'You need to enter a username and password.'
      });
    }
    if (passwordsDontMatch) {
      return this.setState({
        error: 'You need to re-enter your password correctly.'
      });
    }
    const response = await axios.post('/users/register', { username, password, email }).catch(e => e.response);
    if (response.status === 200) {
      // Authenticated, remove login page
      window.location.replace('/login');
    } else if (response.status === 500) {
      this.setState({
        error: 'Our servers seem to be experiencing some problems at the moment, try again later'
      });
    } else {
      // Stay here, login failed
      this.setState({
        error: response.data
      });
    }
  }

  render () {
    return (
      <div className='authentication-page-container'>
        <section className='cinematic-authentication'></section>
        <div className='authentication-container animated fadeIn'>
          <div className='authentication'>
            <div className='authentication-header'>
              <h1>Sign up for Poplet</h1>
              <h4 className='description'>Welcome to Poplet!</h4>
              <h4 className='authentication-header-error'>{this.state.error}</h4>
            </div>
            <form id='signup' className='signup-form'>
              <div className='username-container'>
                <label htmlFor='username'>Username</label>
                <input onInput={(e) => this.setState({ username: e.target.value }, () => this.checkUsername())}
                  id='username' type='text' className={`text-input ${this.state.error && this.state.errorOccured === 'username' ? 'invalid-text-input' : ''}`} />
              </div>

              <div className='email-container'>
                <label htmlFor='username'>E-mail</label>
                <input onInput={(e) => this.setState({ email: e.target.value }, () => this.checkEmail())}
                  id='email' type='email' className={`text-input ${this.state.error && this.state.errorOccured === 'email' ? 'invalid-text-input' : ''}`} />
              </div>

              <div className='password-container'>
                <label htmlFor='password'>Password</label>
                <div className='password-component'>
                  <input onInput={(e) => this.setState({ password: e.target.value || '' }, () => this.checkSecurity())}
                    id='password' type='password' className='text-input'></input>
                  <div className='security-measurer'>
                    <div className='security-color' style={{ backgroundColor: this.state.securityStatus.color }}></div>
                  </div>
                </div>
              </div>

              <div className='password-container'>
                <label htmlFor='password'>Re-enter password</label>
                <input onInput={(e) => this.setState({ passwordReentry: e.target.value || '' }, () => this.checkIfSame(this.state.passwordReentry))}
                  id='pass-reenter' type='password' className={`text-input ${this.state.passwordsDontMatch === null ? '' : (this.state.passwordsDontMatch ? 'invalid-text-input' : 'valid-text-input')}`}></input>
              </div>
            </form>
            <button className='btn login-button' onClick={() => this.signupButtonClicked()}>Submit</button>
            <div className='account-exists'>
              Already have an account? <Link className='account-exists-link' to='/login'>Sign in here.</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUp;

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, MinimalisticButton } from '../..';
import { logout } from './../../../modules';
import Poplet from './../../../index';
import './NavBar.scss';
import axios from 'axios';

function mapStateToProps (state) {
  return {
    user: state.user,
    dev: state.dev
  };
}

class NavBar extends Component {
  constructor ({ name, dev }) {
    super();
    this.name = name;
    this.dev = dev;
  }

  borderElements () {
    for (const elm of [ ...document.querySelectorAll('*') ]) {
      elm.style.border = '0.08px white solid';
    }
  }

  logRequests () {
    axios.interceptors.request.use(request => {
      Poplet.log.prefix(Poplet.log.PREFIX_TYPES.NETWORK).debug('Starting Request', request)
      return request
    })
    
    axios.interceptors.response.use(response => {
      Poplet.log.prefix(Poplet.log.PREFIX_TYPES.NETWORK).debug('Response:', response)
      return response
    })
  }

  render () {
    const { user, name, dev } = this.props;
    return (
      <div className='navbar-container'>
        <div className='board-navbar'>
          <Link className='navbar-img' to='/home'><img src='./../../assets/icons/poplet_white_no_bg.svg' width='24' height='24' alt=''></img></Link>
          <Link to='/home' className='navbar-text'>
            {name || 'Poplet'}
          </Link>

          {(() => {
            if (user && user.id) {
              return (
                <div className='board-navbar-user'>
                  {dev && <div>
                    <ul id='devtools-selector' className='dropdown-content'>
                      <li className='board-selection' onClick={() => this.borderElements()}><p>Show Element Borders</p></li>
                      <li className='board-selection' onClick={() => this.logRequests()}><p>Log Incoming/Outgoing Requests</p></li>
                    </ul>
                    <div className='dev-tools-btn-container dropdown-trigger' data-target='devtools-selector'>
                      <MinimalisticButton icon='developer_mode' color='red' className='dev-tools-btn' />
                      <p>Dev Tools</p>
                    </div>
                  </div>}

                  <div className='board-selector-btn-container dropdown-trigger' data-target='board-selector'>
                    <MinimalisticButton icon='dashboard' color='red' className='board-selector-btn' />
                    <p>Boards</p>
                  </div>

                  <ul id='user-selector' className='dropdown-content'>
                    <Link className='dropdown-link' to={`/users/${user.id}`}><li><i className='material-icons'>person</i>Profile</li></Link>
                    <Link className='dropdown-link' to={`/settings`}><li><i className='material-icons'>settings</i>Settings</li></Link>
                    <li onClick={() => logout()} className='sign-out'><i className='material-icons'>subdirectory_arrow_right</i><p>Sign Out</p></li>
                  </ul>

                  <div className='board-navbar-user-container dropdown-trigger' data-target='user-selector'>
                    <Avatar url={user.avatar} alt={user.username} size={32} />
                    <div className='board-navbar-user-container-username'>{user.username}</div>
                  </div>
                </div>
              );
            } else {
              return (
                <div className='board-navbar-user-container'>
                  <Link className='board-navbar-user-container-username' to='/login'>Sign in</Link>
                </div>
              );
            }
          })()}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(NavBar);

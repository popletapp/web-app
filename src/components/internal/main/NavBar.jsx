import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar } from '../../';
import { logout } from './../../../modules';
import './NavBar.scss';

function mapStateToProps (state) {
  return {
    user: state.user
  };
}

class NavBar extends Component {
  constructor ({ name }) {
    super();
    this.name = name;
  }

  render () {
    const { user, name, icon = 'poplet_white_no_bg' } = this.props;
    return (
      <div className='navbar-container'>
        <div className='navbar'>
          <Link to='/home'><img src={`./../../assets/icons/${icon}.svg`} width='32' height='32' alt='' /></Link>
          <Link to='/home' className='navbar-text'>
            {name || 'Poplet'}
            <div className='beta-badge'>Beta</div>
          </Link>

          <ul id='user-selector' className='dropdown-content'>
            <Link className='dropdown-link' to={`/users/${user.id}`}><li><i className='material-icons'>person</i>Profile</li></Link>
            <li><i className='material-icons'>settings</i><p>Settings</p></li>
            <li onClick={() => logout()} className='sign-out'><i className='material-icons'>subdirectory_arrow_right</i><p>Sign Out</p></li>
          </ul>

          {(() => {
            if (user && user.id) {
              return (  
                <div className='navbar-user-container dropdown-trigger' data-target='user-selector'>
                  <Avatar url={user.avatar} alt={user.username} size={32} />
                  <div className='navbar-user-container-username'>{user.username}</div>
                </div>
              );
            } else {
              return (
                <div className='navbar-register'>
                  <Link className='navbar-register-login' to='/login'>Log in</Link>
                  <p className='navbar-register-or'>or</p>
                  <Link className='navbar-register-login' to='/signup'>Sign up</Link>
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

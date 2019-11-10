import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar } from '../../';
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

          {(() => {
            if (user && user.id) {
              return (
                <Link className='navbar-user-container' to={`/users/${user.id}`}>
                  <Avatar url={user.avatar} alt={user.username} size={32} />
                  <div className='navbar-user-container-username'>{user.username}</div>
                </Link>
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

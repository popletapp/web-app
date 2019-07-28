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
    const { user, name } = this.props;
    return (
      <div className='navbar-container'>
        <div className='navbar'>
          <img src='./../../assets/icons/poplet_white_no_bg.svg' width='32' height='32' alt=''></img>
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
                <div className='navbar-user-container'>
                  <Link className='navbar-user-container-username' to='/login'>Sign in</Link>
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

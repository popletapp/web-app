import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, MinimalisticButton } from '../..';
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
        <div className='board-navbar'>
          <img src='./../../assets/icons/poplet_white_no_bg.svg' width='26' height='26' alt=''></img>
          <Link to='/home' className='navbar-text'>
            {name || 'Poplet'}
          </Link>

          {(() => {
            if (user && user.id) {
              return (
                <div className='board-navbar-user'>
                  <div className='board-selector-btn-container dropdown-trigger' data-target='board-selector'>
                    <MinimalisticButton icon='dashboard' color='red' className='board-selector-btn' />
                    <p>Boards</p>
                  </div>

                  <Link className='board-navbar-user-container' to={`/users/${user.id}`}>
                    <Avatar url={user.avatar} alt={user.username} size={32} />
                    <div className='board-navbar-user-container-username'>{user.username}</div>
                  </Link>
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

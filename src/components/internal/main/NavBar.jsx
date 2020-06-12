import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, BetaModal, PopletBase, NotificationListPopout, MinimalisticButton, Flex } from '../../';
import { logout, createModal } from './../../../modules';
import './NavBar.scss';
import { withTranslation } from 'react-i18next';

function mapStateToProps (state) {
  return {
    user: state.user
  };
}

class NavBar extends PopletBase {
  constructor ({ name }) {
    super();
    this.name = name;
  }

  componentDidMount () {
    this.init(false);
  }

  render () {
    const { user, name, icon = 'poplet_white_no_bg', t } = this.props;
    return (
      <div className='navbar-container'>
        <div className='navbar'>
          <Link className='navbar-img' to='/home'><img src={`./../../assets/icons/${icon}.svg`} width='28' height='28' alt='' /></Link>
          <Link to='/home' className='navbar-text'>
            {name || 'Poplet'}
            <div onClick={() => 
                createModal(<BetaModal />)} 
                className='beta-badge'>{t("NAVBAR_BETA")}</div>
          </Link>

          <ul id='user-selector' className='dropdown-content'>
            <Link className='dropdown-link' to='/home'><li><i className='material-icons'>home</i>{t("DROPDOWN_ITEM_HOME")}</li></Link>
            <Link className='dropdown-link' to={`/users/${user.id}`}><li><i className='material-icons'>person</i>{t("DROPDOWN_ITEM_PROFILE")}</li></Link>
            <Link className='dropdown-link' to={`/settings`}><li><i className='material-icons'>settings</i>{t("DROPDOWN_ITEM_SETTINGS")}</li></Link>
            <li onClick={() => logout()} className='sign-out'><i className='material-icons'>subdirectory_arrow_right</i><p>{t("DROPDOWN_ITEM_LOGOUT")}</p></li>
          </ul>
          
          <Flex grow={0} direction='row' align='center' className='navbar-user-area'>
            <Flex align='right' justify='right' className='board-selector-btn-container navbar-user-area-notifications-btn'>
              <NotificationListPopout placement='left'>
                <MinimalisticButton icon='notifications' className='board-selector-btn' />
              </NotificationListPopout>
            </Flex>

            {(() => {
              if (user && user.id) {
                return (
                  <div className='navbar-user-container dropdown-trigger' data-target='user-selector'>
                    <Avatar id={user.id} url={user.avatar} alt={user.username} size={32} />
                    <div className='navbar-user-container-username'>{user.username}</div>
                  </div>
                );
              } else {
                return (
                  <div className='navbar-register'>
                    <Link className='navbar-register-login' to='/login'>{t("NAVBAR_REGISTER_LOG_IN")}</Link>
                    <p className='navbar-register-or'>{t("NAVBAR_REGISTER_OR")}</p>
                    <Link className='navbar-register-login' to='/signup'>{t("NAVBAR_REGISTER_SIGN_UP")}</Link>
                  </div>
                );
              }
            })()}
          </Flex>
        </div>
      </div>
    );
  }
}

export default withTranslation()(connect(mapStateToProps, null)(NavBar));

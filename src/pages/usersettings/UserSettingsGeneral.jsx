import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Flex, FlexChild, ToggleSwitch, Avatar, UsernameText } from '../../components';
import { addAvatar, updateUser } from '../../modules';
import { withTranslation } from 'react-i18next';

function mapStateToProps (state) {
  return {
    user: state.user
  };
}

class UserSettingsGeneral extends Component {
  constructor () {
    super();
  }

  onAvatarClick () {
    const upload = document.querySelector('.file-upload');
    upload.click();
  }

  onAvatarSelectedFile (e) {
    const { user } = this.props;
    const file = e.target.files.length ? e.target.files[0] : null;
    if (file) {
      addAvatar(user.id, file);
    }
  }

  async toggleCompactMode (val) {
    const { user } = this.props;
    user.compact = val;
    await updateUser(user);
  }

  render () {
    const { t, user } = this.props;
    return (
      <FlexChild direction='column' className='user-settings-content'>
        <h1>{t("SETTINGS")}</h1>
        <hr></hr>

        <form id="file" encType="multipart/form-data"><input onChange={(e) => this.onAvatarSelectedFile(e)} type='file' className='file-upload'></input></form>
        <Flex direction='row' grow={0} className='user-settings-user'>
          <div onClick={() => this.onAvatarClick()} className='user-settings-user-avatar-container'>
            <Avatar id={user.id} className='user-settings-user-avatar' url={user.avatar} size='large' alt={user.username}></Avatar>
          </div>
          
          <UsernameText className='user-settings-user-username'>{user.username}</UsernameText>
        </Flex>

        <Flex direction='row' grow={0} className='user-settings-setting'>
          <FlexChild direction='column'>
            <header className='user-settings-header'>
              {t("USER_SETTINGS_GENERAL_COMPACT_MODE")}
            </header>
            <h5 className='user-settings-setting-desc'>
              {t("USER_SETTINGS_GENERAL_COMPACT_MODE_DESCRIPTION")}
            </h5>
          </FlexChild>

          <ToggleSwitch onChange={(val) => this.toggleCompactMode(val)} small={true} initialState={user.compact} />
        </Flex>
      </FlexChild>
    )
  }
}

export default withTranslation()(connect(mapStateToProps, null)(UserSettingsGeneral));

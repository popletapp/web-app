import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Flex, FlexChild, Checkbox } from '../../components';
import { updateUser } from '../../modules';
import { withTranslation } from 'react-i18next';

function mapStateToProps (state, props) {
  return {
    user: state.user
  };
}

class UserSettingsAppearance extends Component {
  constructor (props) {
    super(props);
    this.state = {
      theme: props.user.theme
    };
  }

  async changeTheme (val) {
    const { user } = this.props;
    user.theme = val;
    await updateUser(user);
  }

  render () {
    const { t, user } = this.props;
    return (
      <FlexChild direction='column' className='user-settings-content'>
        <h1>{t("SETTINGS")}</h1>
        <hr></hr>

        <Flex direction='column' grow={0} className='user-settings-setting'>
          <FlexChild direction='column'>
            <header className='user-settings-header'>
              {t("USER_SETTINGS_APPEARANCE_THEME")}
            </header>
          </FlexChild>
          
          <FlexChild className='user-settings-appearance'>
            <Checkbox initialState={user.theme === 0} checked={user.theme === 0} 
              onClick={() => this.changeTheme(0)} label='Dark' />
            <Checkbox initialState={user.theme === 1} checked={user.theme === 1} 
              onClick={() => this.changeTheme(1)} label='Light' />
          </FlexChild>
        </Flex>
      </FlexChild>
    )
  }
}

export default withTranslation()(connect(mapStateToProps, null)(UserSettingsAppearance));

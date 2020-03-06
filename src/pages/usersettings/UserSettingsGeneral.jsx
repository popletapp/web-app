import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Flex, FlexChild, ToggleSwitch } from '../../components';
import { Messages } from '../../i18n';

function mapStateToProps (state, props) {
  return {
    user: state.user
  };
}

class UserSettingsGeneral extends Component {
  constructor () {
    super();
  }

  render () {
    return (
      <FlexChild direction='column' className='user-settings-content'>
        <h1>{Messages.SETTINGS}</h1>
        <hr></hr>

        <Flex direction='row' grow={0} className='user-settings-setting'>
          <FlexChild direction='column'>
            <header className='user-settings-header'>
              {Messages.USER_SETTINGS_GENERAL_COMPACT_MODE}
            </header>
            <h5 className='user-settings-setting-desc'>
              {Messages.USER_SETTINGS_GENERAL_COMPACT_MODE_DESCRIPTION}
            </h5>
          </FlexChild>
          
          <ToggleSwitch small={true} />
        </Flex>
      </FlexChild>
    )
  }
}

export default connect(mapStateToProps, null)(UserSettingsGeneral);

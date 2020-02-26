import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Flex, FlexChild, ToggleSwitch } from '../../components';

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
        <h1>Settings</h1>
        <hr></hr>

        <Flex direction='row' grow={0} className='user-settings-setting'>
          <FlexChild direction='column'>
            <header className='user-settings-header'>
              Compact Mode
            </header>
            <h5 className='user-settings-setting-desc'>
              Makes notes and other components take up less space on the screen; a simplified view.
            </h5>
          </FlexChild>
          
          <ToggleSwitch small={true} />
        </Flex>
      </FlexChild>
    )
  }
}

export default connect(mapStateToProps, null)(UserSettingsGeneral);

import React, { Component } from 'react';
import { joinClasses } from './../../../util';
import './ToggleSwitch.scss';

class ToggleSwitch extends Component {
  constructor (props) {
    super(props);
    this.state = {
      toggled: null
    };
  }

  toggle () {
    const { toggled } = this.state;
    this.setState({ toggled: !toggled });
    const { onChange } = this.props;
    if (onChange && typeof onChange === 'function') {
      onChange(!toggled);
    }
  }

  render () {
    let { toggled } = this.state;
    const { small, style, initialState } = this.props;
    if (toggled === null) {
      toggled = initialState;
    }
    return (
      <div style={style} className='toggle-switch-container' onClick={(e) => this.toggle(e)}>
        <div className={joinClasses('toggle-switch', `switch-${toggled ? 'on' : 'off'}`, small ? 'switch-small' : null)}>
          <div className='toggle-switch-knob'></div>
        </div>
      </div>
    );
  }
}

export default ToggleSwitch;

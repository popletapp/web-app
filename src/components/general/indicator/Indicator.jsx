import React, { Component } from 'react';
import { Flex } from './../../';
import { joinClasses } from './../../../util';
import './Indicator.scss';
import { Messages } from './../../../i18n';

const MODE_TO_FRIENDLY = {
  online: Messages.INDICATOR_STATUS_ONLINE,
  idle: Messages.INDICATOR_STATUS_IDLE,
  dnd: Messages.INDICATOR_STATUS_DND,
  offline: Messages.INDICATOR_STATUS_OFFLINE
};

class Indicator extends Component {
  constructor (props) {
    super();
    if (!props) {
      return;
    }
    const MODES = ['online', 'idle', 'dnd', 'offline'];
    if (MODES.indexOf(props.mode) === -1) {
      throw new Error(`\`mode\` should be one of ${MODES.join(', ')}`);
    }
  }

  render () {
    const { style, className, mode, text } = this.props;

    return (
      <Flex
        direction='row'
        grow={0}
        style={style}
        align='center'
        className={joinClasses('indicator', mode, className)}>
        <div className='indicator-icon' />
        {text && <div className='indicator-text'>{MODE_TO_FRIENDLY[mode]}</div>}
      </Flex>
    );
  }
}

export default Indicator;

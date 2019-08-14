import React, { Component } from 'react';
import { Flex } from './../../';
import { joinClasses } from './../../../util';
import './Indicator.scss';

const MODE_TO_FRIENDLY = {
  online: 'Online',
  idle: 'Idle',
  dnd: 'Do Not Disturb',
  offline: 'Offline'
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

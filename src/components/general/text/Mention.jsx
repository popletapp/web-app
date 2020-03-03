import React, { Component } from 'react';
import { joinClasses } from './../../../util';
import './Text.scss';
import { Flex } from '../..';

class Mention extends Component {
  render () {
    const { children, className } = this.props;
    return (
      <Flex direction='row' inline className={joinClasses('mention', className)}>
        <div className='mention-at'>@</div><div className='mention-content'>{children}</div>
      </Flex>
    );
  }
}

export default Mention;

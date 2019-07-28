import React, { Component } from 'react';
import { joinClasses } from './../../../util';
import './Text.scss';

class UsernameText extends Component {
  render () {
    const { children, className } = this.props;
    return (
      <div className={joinClasses('username-text', className)}>{children}</div>
    );
  }
}

export default UsernameText;

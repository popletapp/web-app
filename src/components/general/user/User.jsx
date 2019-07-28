import React, { Component } from 'react';
import { joinClasses } from './../../../util';
import { Avatar, UsernameText, Flex, FlexChild } from './../../';

class User extends Component {
  render () {
    const { className, avatar, avatarSize = 32, username } = this.props;
    return (
      <Flex direction='row' align='center' className={joinClasses('user-container', className)}>
        <FlexChild>
          <Avatar size={avatarSize} url={avatar} alt={username} />
        </FlexChild>
        <FlexChild style={{ marginLeft: '12px' }}>
          <UsernameText>{username}</UsernameText>
        </FlexChild>
      </Flex>
    );
  }
}

export default User;

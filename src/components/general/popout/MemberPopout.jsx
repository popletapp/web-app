import React from 'react';
import Popout from './Popout';
import { Flex, FlexChild, Avatar, Button, Indicator } from '../../';
import './Popout.scss';

class MemberPopout extends Popout {
  content () {
    const { member } = this.props;
    return (
      <Flex className='popout'>
        <FlexChild className='popout-content'>
          <Flex direction='row' className='popout-header member-popout-header'>
            <Avatar url={member.avatar} alt={member.username} size='medium' />
            <FlexChild className='member-popout-title'>
              <div className='member-popout-username'>{member.username}</div>
              <Indicator mode='online' text={true} />
            </FlexChild>
          </Flex>

          <Flex direction='row' className='popout-body member-popout-body'>
            <FlexChild className='member-popout-body-item'>
              <div className='member-popout-subheading'>
            Created
              </div>
              {new Date(member.createdAt).toLocaleDateString()}
            </FlexChild>

            <FlexChild className='member-popout-body-item'>
              <div className='member-popout-subheading'>
            Joined Board
              </div>
              {new Date(member.joinedAt).toLocaleDateString()}
            </FlexChild>
          </Flex>

          <Button>View Profile</Button>
        </FlexChild>

        <Flex className='popout-footer member-popout-footer' direction='row' justify='end' align='right'>
          More actions coming soon. Thanks for using Poplet!
        </Flex>
      </Flex>
    );
  }
}

export default MemberPopout;

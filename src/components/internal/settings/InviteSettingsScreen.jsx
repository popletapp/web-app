import React, { Component } from 'react';
import { SelectableItem, ToggleSwitch, List, Scroller, Flex, FlexChild, User } from './../../';
import { connect } from 'react-redux';

function mapStateToProps (state) {
  return {
    users: state.users
  };
}

class InviteSettingsScreen extends Component {
  render () {
    let { users } = this.props;
    users = users ? users.items : [];
    const invites = {};

    return (
      <Flex direction='column' align='left' className='board-settings-content-container'>
        <div className='board-settings-header'>
          Invites
        </div>
        <div className='board-settings-text'>
          You can control who can create invites in the `Ranks` tab.
        </div>

        <Flex direction='row' grow={0} className='board-settings-subheader'>
          Whitelist
          <ToggleSwitch small={true} style={{ marginLeft: '24px' }} />
        </Flex>

        <List style={{ height: '300px', maxHeight: '300px' }}>
          <Scroller>
            {users.map((user, i) =>
              <SelectableItem key={i} className='user-item' id={user.id} selected={false}>
                <Flex align='left' basis='auto' grow={1} shrink={1}>
                  <FlexChild align='left' direction='row' basis='auto' grow={1} shrink={1}>
                    <User avatar={user.avatar} username={user.username} />
                  </FlexChild>
                </Flex>
              </SelectableItem>)}
          </Scroller>
        </List>

        <div className='board-settings-subheader'>
          Active Invites
        </div>

        <List style={{ height: '300px', maxHeight: '300px', backgroundColor: 'transparent' }}>
          <Scroller>
            {Object.values(invites).map((user, i) =>
              <SelectableItem className='user-item' id={user.id} key={i.toString()} selected={false}>
                <Flex align='center' basis='auto' grow={1} shrink={1}>
                  <div>
                    <Flex align='center' basis='auto' grow={1} shrink={1}>
                      <FlexChild key='code' align='left' basis='auto' grow={1} shrink={1} wrap={false}>
                        <h1>{invites.code}</h1>
                      </FlexChild>
                      <FlexChild key='invite-info' align='right' basis='auto' grow={1} shrink={1} wrap={false}>
                        <h5>created by {invites.createdBy}</h5>
                      </FlexChild>
                    </Flex>
                  </div>
                </Flex>
              </SelectableItem>)}
          </Scroller>
        </List>
      </Flex>
    );
  }
}

export default connect(mapStateToProps, null)(InviteSettingsScreen);

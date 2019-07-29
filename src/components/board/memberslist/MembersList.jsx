import React, { Component } from 'react';
import { SelectableItem, List, Scroller, Flex, FlexChild, User } from './../../';
import { connect } from 'react-redux';
import './MembersList.scss';

function mapStateToProps (state) {
  return {
    members: state.membersByBoard[state.selectedBoard]
  };
}

class MembersList extends Component {
  render () {
    let { members } = this.props;
    if (!members) {
      return null;
    }
    members = Object.values(members);

    return (
      <Flex direction='column' align='left' className='members-list'>
        <div className='members-list-header'>
          Members
        </div>

        <List style={{ height: '100%' }}>
          <Scroller>
            {members.map((user, i) =>
              <SelectableItem key={i} className='user-item' id={user.id} selected={false}>
                <Flex align='left' basis='auto' grow={1} shrink={1}>
                  <FlexChild align='left' direction='row' basis='auto' grow={1} shrink={1}>
                    <User avatar={user.avatar} username={user.username} />
                  </FlexChild>
                </Flex>
              </SelectableItem>)}
          </Scroller>
        </List>
      </Flex>
    );
  }
}

export default connect(mapStateToProps, null)(MembersList);

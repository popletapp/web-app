import React, { Component } from 'react';
import { SelectableItem, List, Scroller, Flex, FlexChild, User, MemberPopout } from './../../';
import { createPopout } from './../../../modules';
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
      <Flex direction='column' align='stretch' className='members-list' grow={1}>
        <List className='align-stretch' style={{flexGrow: 1}}>
          <Scroller>
            <header>
              Members
            </header>
            {members.map((user, i) =>
              <MemberPopout key={i+4} member={user}>
                <SelectableItem
                  key={i}
                  className='user-item'
                  id={user.id}
                  selected={false}>
                  <Flex align='left' basis='auto' grow={1} shrink={1}>
                    <FlexChild align='left' direction='row' basis='auto' grow={1} shrink={1}>
                      <User avatar={user.avatar} username={user.username} />
                    </FlexChild>
                  </Flex>
                </SelectableItem>
              </MemberPopout>)}
          </Scroller>
        </List>
      </Flex>
    );
  }
}

export default connect(mapStateToProps, null)(MembersList);

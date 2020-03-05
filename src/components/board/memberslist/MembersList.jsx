import React, { Component } from 'react';
import { SelectableItem, List, Scroller, Flex, 
  FlexChild, User, MemberPopout, ContextMenu } from './../../';
import { createContextMenu } from './../../../modules';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import './MembersList.scss';

function mapStateToProps (state) {
  return {
    members: state.membersByBoard[state.selectedBoard]
  };
}

class MembersList extends Component {
  constructor () {
    super();
    this.state = {};
  }

  render () {
    let { members } = this.props;
    const { showContextMenu } = this.state;
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
                  onRightClick={(event) => {
                    createContextMenu('contextmenu', [
                      {
                        name: 'View Profile',
                        onClick: () => document.location.replace(`/users/${user.id}`)
                      },
                      {
                        name: 'Change Nickname',
                        onClick: () => console.log('Clicker')
                      },
                    ], { x: event.clientX, y: event.clientY })
                  }}
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

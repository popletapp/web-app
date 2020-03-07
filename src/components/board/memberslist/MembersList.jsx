import React, { Component } from 'react';
import { SelectableItem, List, Scroller, Flex, 
  FlexChild, User, MemberPopout, ContextMenu } from './../../';
import { createContextMenu } from './../../../modules';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import './MembersList.scss';
import { withTranslation } from 'react-i18next';

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
    let { members, t } = this.props;
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
              {t("MEMBERS_LIST_MEMBERS_HEADER")}
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
                      <User id={user.id} avatar={user.avatar} username={user.username} />
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

export default withTranslation()(connect(mapStateToProps, null)(MembersList));

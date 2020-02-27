import React, { Component } from 'react';
import { SelectableItem, ToggleSwitch, List, Scroller, Flex, FlexChild, Button, DefaultInput, ColorPicker } from '../..';
import { addRank, deleteRank, updateRank, updateMember } from '../../../modules';
import { Permissions }  from './../../../util/permissions';
import { permissions as PermissionHandler }  from './../../../util';
import { connect } from 'react-redux';

function mapStateToProps (state) {
  return {
    ranks: state.ranksByBoard[state.selectedBoard],
    boardId: state.selectedBoard
  };
}

const PermissionsFriendly = {
  'MANAGE_NOTES': {
    id: 'MANAGE_NOTES',
    name: 'Manage and Edit Notes/Groups',
    description: 'When this permission is granted, members can create, modify and delete notes and groups'
  },
  'MANAGE_MEMBERS': {
    id: 'MANAGE_MEMBERS',
    name: 'Manage Members',
    description: 'Members with this permission can modify the nickname and permissions of other members'
  },
  'MOVE_NOTES': {
    id: 'MOVE_NOTES',
    name: 'Move Notes/Groups'
  },
  'MODERATOR': {
    id: 'MODERATOR',
    name: 'Moderator',
    description: 'Moderators have the ability to invite members to the board as well as kicking members from the board'
  },
  'ADMINISTRATOR': {
    id: 'ADMINISTRATOR',
    name: 'Administrator',
    description: 'Members with this permission have full access to the board and can modify everything'
  },
  'VIEW_CHATROOMS': {
    id: 'VIEW_CHATROOMS',
    name: 'View Chatrooms',
    description: 'Allows members to access chatrooms in the board'
  },
  'ADD_COMMENTS': {
    id: 'ADD_COMMENTS',
    name: 'Add Comments to Notes'
  },
  'SEND_CHATROOM_MESSAGES': {
    id: 'SEND_CHATROOM_MESSAGES',
    name: 'Send Chatroom Messages',
    description: 'This permission allows members to send messages in chatrooms'
  },
  'INVITE_MEMBERS': {
    id: 'INVITE_MEMBERS',
    name: 'Invite New Members'
  },
  'KICK_MEMBERS': {
    id: 'KICK_MEMBERS',
    name: 'Kick Members'
  },
  'BAN_MEMBERS': {
    id: 'BAN_MEMBERS',
    name: 'Ban Members'
  },
  'MANAGE_BOARD': {
    id: 'MANAGE_BOARD',
    name: 'Manage Board',
    description: 'Members with this permission can edit certain settings in the board such as ranks'
  }
};

class RankSettingsScreen extends Component {
  constructor (props) {
    super(props);
    const { ranks } = this.props;
    this.state = {
      selectedRank: (Object.values(ranks)[0] || {}) || null,
      editingName: false,
      color: '#ffffff'
    };
  }

  async createRank () {
    const { boardId } = this.props;
    const rank = await addRank(boardId, { name: 'Default', color: null, permissions: 0, position: 0 });
    if (rank) {
      this.selectRank(rank.id);
    }
  }

  async deleteRank (id) {
    const { boardId } = this.props;
    const rank = await deleteRank(boardId, id);
    if (rank) {
      this.selectRank();
    }
  }

  selectRank (id) {
    const { ranks } = this.props;
    if (!id) {
      id = Object.values(ranks)[0].id;
    }
    this.setState({
      selectedRank: ranks[id]
    });
    this.forceUpdate();
  }

  async updateRankName (e) {
    const { boardId } = this.props;
    const { selectedRank } = this.state;
    const newName = e.target.value;
    selectedRank.name = newName;
    await updateRank(boardId, selectedRank);
    this.setState({ editingName: false, selectedRank });
  }

  async addPermissionToRank (toggleValue, permissionValue) {
    const { boardId } = this.props;
    const { selectedRank } = this.state;
    permissionValue = Permissions[permissionValue];

    if (toggleValue) {
      selectedRank.permissions |= permissionValue;
    } else {
      selectedRank.permissions ^= permissionValue;
    }
    console.log(selectedRank.permissions)

    await updateRank(boardId, selectedRank);
    this.setState({ selectedRank });
  }

  render () {
    const { ranks } = this.props;
    let { selectedRank } = this.state;
    console.log(selectedRank.name, selectedRank)
    if (!selectedRank) {
      this.setState({ 
        selectedRank: (Object.values(ranks)[0] || {})
      });
      return null;
    }

    return (
      <Flex direction='column' align='left' className='board-settings-content-container'>
        <div className='board-settings-header'>
          Ranks
        </div>
        <div className='board-settings-text'>
          Ranks allow you to assign permissions to members in your board.
        </div>

        <Button onClick={() => this.createRank()}>
          Create Rank
        </Button>

        <Flex align='left' direction='row' className='board-settings-ranks'>
          <FlexChild>
            <List style={{ height: '600px', width: '140px', minWidth: '125px' }}>
              <Scroller>
                {!Object.values(ranks).length && <div className='board-settings-subheader'>No ranks</div>}
                {!!Object.values(ranks).length && Object.values(ranks).map((rank, i) => rank && 
                  <SelectableItem className='board-settings-rank-item' onClick={() => this.selectRank(rank.id)} id={rank.id} key={i.toString()} selected={selectedRank.id === rank.id}>
                    <Flex align='left' basis='auto' grow={1} shrink={1}>
                      <div>
                        <Flex align='left' basis='auto' grow={1} shrink={1}>
                          <FlexChild key='user' basis='auto' grow={1} shrink={1} wrap={false}>
                            {rank.name}
                          </FlexChild>
                        </Flex>
                      </div>
                    </Flex>
                  </SelectableItem>)}
              </Scroller>
            </List>
          </FlexChild>

          <Flex align='left' direction='row'>
            {!Object.values(ranks).length && <div>Click "Create Rank" to create a new rank!</div>}
            {!!Object.values(ranks).length &&
              <Scroller style={{ maxHeight: '600px' }}>
                <Flex className='board-settings-ranks-content'>
                  <FlexChild align='left' direction='row'>
                    <Flex align='left' direction='row'>
                      <FlexChild align='left'>
                        <div className='board-settings-subheader'>Name</div>
                        <DefaultInput
                          onBlur={(e) => this.updateRankName(e)}
                          value={selectedRank.name}
                          style={{ height: '32px' }}>
                        </DefaultInput>
                      </FlexChild>
                      <FlexChild align='right' style={{ marginLeft: '24px' }}>
                        <Button onClick={() => this.selectRank()} color='red'>
                          Delete
                        </Button>
                      </FlexChild>
                    </Flex>
                  </FlexChild>

                  <FlexChild>
                    <div className='board-settings-subheader'>Color</div>
                    <ColorPicker
                      color={this.state.color}
                      onChangeComplete={(color) => this.handleColorChange(color)}
                    />
                  </FlexChild>

                  <FlexChild align='left' className='board-settings-ranks-permissions'>
                    <div className='board-settings-subheader'>
                    Permissions
                    </div>
                    {Object.values(PermissionsFriendly)
                      .map((permission, i) =>
                        <Flex key={i} align='left' className='board-settings-ranks-permissions-permission' direction='row' style={{ width: '100%' }}>
                          <FlexChild align='left'>
                            {permission.name}
                            <div className='board-settings-text' style={{ fontSize: '13px' }}>
                              {permission.description}
                            </div>
                          </FlexChild>

                          <FlexChild align='right'>
                            <ToggleSwitch onChange={(_) => this.addPermissionToRank(_, permission.id)} small initialState={selectedRank.permissions & Permissions[permission.id]} />
                          </FlexChild>
                        </Flex>
                      )}
                  </FlexChild>
                </Flex>
              </Scroller>
            }
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

export default connect(mapStateToProps, null)(RankSettingsScreen);

import React, { Component } from 'react';
import { SelectableItem, ToggleSwitch, List, Scroller, Flex, FlexChild, Button, DefaultInput, ColorPicker } from '../..';
import { addRank, deleteRank, updateRank, updateMember } from '../../../modules';
import { Permissions }  from './../../../util/permissions';
import { permissions as PermissionHandler }  from './../../../util';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

function mapStateToProps (state) {
  return {
    ranks: state.ranksByBoard[state.selectedBoard],
    boardId: state.selectedBoard
  };
}

const PermissionsFriendly = {
  'MANAGE_NOTES': {
    id: 'MANAGE_NOTES',
    name: "BOARD_SETTINGS_RANKS_MANAGE_NOTES_TITLE",
    description: "BOARD_SETTINGS_RANKS_MANAGE_NOTES_DESCRIPTION"
  },
  'MANAGE_MEMBERS': {
    id: 'MANAGE_MEMBERS',
    name: "BOARD_SETTINGS_RANKS_MANAGE_MEMBERS_TITLE",
    description: "BOARD_SETTINGS_RANKS_MANAGE_MEMBERS_DESCRIPTION"
  },
  'MOVE_NOTES': {
    id: 'MOVE_NOTES',
    name: "BOARD_SETTINGS_RANKS_MOVE_NOTES_TITLE"
  },
  'MODERATOR': {
    id: 'MODERATOR',
    name: "BOARD_SETTINGS_RANKS_MODERATOR_TITLE",
    description: "BOARD_SETTINGS_RANKS_MODERATOR_DESCRIPTION"
  },
  'ADMINISTRATOR': {
    id: 'ADMINISTRATOR',
    name: "BOARD_SETTINGS_RANKS_ADMINISTRATOR_TITLE",
    description: "BOARD_SETTINGS_RANKS_ADMINISTRATOR_DESCRIPTION"
  },
  'VIEW_CHATROOMS': {
    id: 'VIEW_CHATROOMS',
    name: "BOARD_SETTINGS_RANKS_VIEW_CHATROOMS_TITLE",
    description: "BOARD_SETTINGS_RANKS_VIEW_CHATROOMS_DESCRIPTION"
  },
  'ADD_COMMENTS': {
    id: 'ADD_COMMENTS',
    name: "BOARD_SETTINGS_RANKS_ADD_COMMENTS_TITLE"
  },
  'SEND_CHATROOM_MESSAGES': {
    id: 'SEND_CHATROOM_MESSAGES',
    name: "BOARD_SETTINGS_RANKS_SEND_CHATROOM_MESSAGES_TITLE",
    description: "BOARD_SETTINGS_RANKS_SEND_CHATROOM_MESSAGES_DESCRIPTION"
  },
  'INVITE_MEMBERS': {
    id: 'INVITE_MEMBERS',
    name: "BOARD_SETTINGS_RANKS_INVITE_MEMBERS_TITLE"
  },
  'KICK_MEMBERS': {
    id: 'KICK_MEMBERS',
    name: "BOARD_SETTINGS_RANKS_KICK_MEMBERS_TITLE"
  },
  'BAN_MEMBERS': {
    id: 'BAN_MEMBERS',
    name: "BOARD_SETTINGS_RANKS_BAN_MEMBERS_TITLE"
  },
  'MANAGE_BOARD': {
    id: 'MANAGE_BOARD',
    name: "BOARD_SETTINGS_RANKS_MANAGE_BOARD_TITLE",
    description: "BOARD_SETTINGS_RANKS_MANAGE_BOARD_DESCRIPTION"
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
    const { ranks, t } = this.props;
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
          {t("BOARD_SETTINGS_CATEGORY_RANKS")}
        </div>
        <div className='board-settings-text'>
          {t("BOARD_SETTINGS_CATEGORY_RANKS_DESCRIPTION")}
        </div>

        <Button onClick={() => this.createRank()}>
          {t("BOARD_SETTINGS_RANKS_CREATE_RANK")}
        </Button>

        <Flex align='left' direction='row' className='board-settings-ranks'>
          <FlexChild>
            <List style={{ height: '600px', width: '140px', minWidth: '125px' }}>
              <Scroller>
                {!Object.values(ranks).length && <div className='board-settings-subheader'>{"BOARD_SETTINGS_RANKS_NO_RANKS"}</div>}
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
            {!Object.values(ranks).length && <div>{t("BOARD_SETTINGS_RANKS_CREATE_RANK_SUGGESTION")}</div>}
            {!!Object.values(ranks).length &&
              <Scroller style={{ maxHeight: '600px' }}>
                <Flex className='board-settings-ranks-content'>
                  <FlexChild align='left' direction='row'>
                    <Flex align='left' direction='row'>
                      <FlexChild align='left'>
                        <div className='board-settings-subheader'>{"NAME"}</div>
                        <DefaultInput
                          onBlur={(e) => this.updateRankName(e)}
                          value={selectedRank.name}
                          style={{ height: '32px' }}>
                        </DefaultInput>
                      </FlexChild>
                      <FlexChild align='right' style={{ marginLeft: '24px' }}>
                        <Button onClick={() => this.selectRank()} color='red'>
                          {t("DELETE")}
                        </Button>
                      </FlexChild>
                    </Flex>
                  </FlexChild>

                  <FlexChild>
                    <div className='board-settings-subheader'>{"COLOR"}</div>
                    <ColorPicker
                      color={this.state.color}
                      onChangeComplete={(color) => this.handleColorChange(color)}
                    />
                  </FlexChild>

                  <FlexChild align='left' className='board-settings-ranks-permissions'>
                    <div className='board-settings-subheader'>
                      {t("BOARD_SETTINGS_RANKS_PERMISSIONS")}
                    </div>
                    {Object.values(PermissionsFriendly)
                      .map((permission, i) =>
                        <Flex key={i} align='left' className='board-settings-ranks-permissions-permission' direction='row' style={{ width: '100%' }}>
                          <FlexChild align='left'>
                            {t(permission.name)}
                            <div className='board-settings-text' style={{ fontSize: '13px' }}>
                              {t(permission.description)}
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

export default withTranslation()(connect(mapStateToProps, null)(RankSettingsScreen));

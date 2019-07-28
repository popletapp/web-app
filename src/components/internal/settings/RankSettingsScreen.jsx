import React, { Component } from 'react';
import { SelectableItem, ToggleSwitch, List, Scroller, Flex, FlexChild, Button, DefaultInput, ColorPicker } from '../..';
import { addRank, deleteRank, updateRank } from '../../../modules';
import { connect } from 'react-redux';

function mapStateToProps (state) {
  return {
    ranks: state.ranksByBoard[state.selectedBoard],
    boardId: state.selectedBoard
  };
}

const PermissionsFriendly = {
  USER: { name: 'User', description: '' },
  ADMINISTRATOR: { name: 'Administrator', description: 'Members with administrator have access to all permissions, including editing the board, it\'s notes or any members.' }, // Board Owner
  MODERATOR: { name: 'Moderator', description: 'Members who are moderators are able to manage members and kick them from the board.' },
  EDITOR: { name: 'Editor', description: 'Members with this permission have access to edit or delete any notes on the board.' }
};
const Permissions = {
  0: 'USER',
  8: 'ADMINISTRATOR', // Board Owner
  16: 'MODERATOR',
  32: 'EDITOR'
};
// Make it so all permissions are accessible by their bitfield and name
for (const permission in Permissions) {
  Permissions[Permissions[permission]] = permission;
}

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
    console.log(rank);
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
    console.log('select');
    const { ranks } = this.props;
    if (!id) {
      console.log(ranks);
      id = Object.values(ranks)[0].id;
    }
    this.setState({
      selectedRank: Object.values(ranks).find(r => r.id === id)
    });
  }

  async updateRankName (e) {
    const { boardId } = this.props;
    const { selectedRank } = this.state;
    const newName = e.target.textContent;
    selectedRank.name = newName;
    await updateRank(boardId, selectedRank);
    this.setState({ editingName: false, selectedRank });
  }

  render () {
    const { ranks } = this.props;
    const { selectedRank } = this.state;

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
                {!!Object.values(ranks).length && Object.values(ranks).map((rank, i) =>
                  <SelectableItem className='user-item' onClick={() => this.selectRank(rank.id)} id={rank.id} key={i.toString()} selected={selectedRank.id === rank.id}>
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
                            <ToggleSwitch small />
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

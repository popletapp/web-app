import React, { Component } from 'react';
import { DefaultInput, ToggleSwitch, Flex } from '../..';
import { connect } from 'react-redux';
import { updateBoard } from '../../../actions/board';

function mapStateToProps (state, props) {
  return {
    board: state.boards[state.selectedBoard]
  };
}

class GeneralSettingsScreen extends Component {
  async updateBoardName (e) {
    const { board } = this.props;
    const name = e.target.textContent;
    board.name = name;
    await updateBoard(board.id, board);
    this.setState({ editingName: false, board });
  }

  render () {
    const { board } = this.props;
    return (
      <Flex direction='column' align='left' className='board-settings-content-container'>
        <div className='board-settings-header'>
          General
        </div>
        <div className='board-settings-text'>
          Adjust general settings within this board
        </div>

        <div className='board-settings-subheader'>
          Name
        </div>
        <DefaultInput
          onBlur={(e) => this.updateBoardName(e)}
          value={board.name}
          style={{ height: '32px' }}>
        </DefaultInput>

        <Flex direction='row' grow={0} className='board-settings-subheader'>
          Auto-Resize
          <ToggleSwitch small={true} style={{ marginLeft: '24px' }} />
        </Flex>
      </Flex>
    );
  }
}

export default connect(mapStateToProps, null)(GeneralSettingsScreen);

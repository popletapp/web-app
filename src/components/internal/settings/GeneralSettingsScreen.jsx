import React, { Component } from 'react';
import { DefaultInput, ToggleSwitch, Flex } from '../..';
import { connect } from 'react-redux';
import { updateBoard } from '../../../modules';
import { Messages } from '../../../i18n';

function mapStateToProps (state, props) {
  return {
    board: state.boards[state.selectedBoard]
  };
}

class GeneralSettingsScreen extends Component {
  async updateBoardName (e) {
    const { board } = this.props;
    const name = e.target.value;
    board.name = name;
    await updateBoard(board.id, board);
  }

  async updateBoardType (type) {
    const { board } = this.props;
    board.type = type;
    await updateBoard(board.id, board);
  }

  async updateBoardResize (resize) {
    const { board } = this.props;
    board.autoResize = resize;
    await updateBoard(board.id, board);
  }

  render () {
    const { board } = this.props;
    const { type } = board;
    return (
      <Flex direction='column' align='left' className='board-settings-content-container'>
        <div className='board-settings-header'>
          {Messages.BOARD_SETTINGS_CATEGORY_GENERAL}
        </div>
        <div className='board-settings-text'>
          {Messages.BOARD_SETTINGS_CATEGORY_GENERAL_DESCRIPTION}
        </div>

        <div className='board-settings-subheader'>{Messages.BOARD_SETTINGS_GENERAL_NAME_HEADER}</div>
        <DefaultInput
          onBlur={(e) => this.updateBoardName(e)}
          value={board.name}
          style={{ height: '32px' }}>
        </DefaultInput>

        <div className='board-settings-subheader'>{Messages.BOARD_SETTINGS_GENERAL_TYPE_HEADER}</div>
        <Flex direction='row' grow={0} className='board-creation-type'>
          <Flex onClick={() => this.updateBoardType(0)} className={`board-creation-type-option${type === 0 ? ' board-creation-type-option-active' : ''}`} align='center' direction='column'>
            <Flex className='board-creation-type-option-display' align='center'>
              <h2 className='board-creation-type-option-header'>{Messages.FREEPLACE}</h2>
              <img alt='Freeplace' src='./../../../assets/icons/freeplace.svg' width='128' height='128'></img>
            </Flex>
            <div className='board-creation-type-option-desc'>{Messages.FREEPLACE_DESCRIPTION}</div>
          </Flex>

          <Flex onClick={() => this.updateBoardType(1)} className={`board-creation-type-option${type === 1 ? ' board-creation-type-option-active' : ''}`}  align='center' direction='column'>
            <Flex className='board-creation-type-option-display' align='center'>
              <h2 className='board-creation-type-option-header'>{Messages.GRID}</h2>
              <img alt='Grid' src='./../../../assets/icons/snaptogrid.svg' width='128' height='128'></img>
            </Flex>
            <div className='board-creation-type-option-desc'>{Messages.GRID_DESCRIPTION}</div>
          </Flex>
        </Flex>

        <Flex direction='row' grow={0} className='board-settings-subheader'>
          {Messages.BOARD_SETTINGS_GENERAL_AUTO_RESIZE}
          <ToggleSwitch onChange={(resize) => this.updateBoardResize(resize)} small={true} style={{ marginLeft: '24px' }} />
        </Flex>
      </Flex>
    );
  }
}

export default connect(mapStateToProps, null)(GeneralSettingsScreen);

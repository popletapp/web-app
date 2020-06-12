import React, { Component } from 'react';
import { DefaultInput, Avatar, ToggleSwitch, Flex } from '../..';
import { connect } from 'react-redux';
import { updateBoard, addAvatar } from '../../../modules';
import { withTranslation } from 'react-i18next';

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

  onAvatarClick () {
    const upload = document.querySelector('.file-upload');
    upload.click();
  }

  onAvatarSelectedFile (e) {
    const { board } = this.props;
    const file = e.target.files.length ? e.target.files[0] : null;
    if (file) {
      addAvatar(board.id, file, 'boards');
    }
  }

  render () {
    const { board, t } = this.props;
    const { type } = board;
    return (
      <Flex direction='column' align='left' className='board-settings-content-container'>
        <div className='board-settings-header'>
          {t("BOARD_SETTINGS_CATEGORY_GENERAL")}
        </div>
        <div className='board-settings-text'>
          {t("BOARD_SETTINGS_CATEGORY_GENERAL_DESCRIPTION")}
        </div>

        <form id="file" encType="multipart/form-data"><input onChange={(e) => this.onAvatarSelectedFile(e)} type='file' className='file-upload'></input></form>
        <Flex direction='row' grow={0} className='board-settings-board'>
          <div onClick={() => this.onAvatarClick()} className={`board-settings-board-avatar-container ${board.avatar && 'avatar-contains-img'}`}>
            <Avatar id={board.id} className='board-settings-board-avatar' url={board.avatar} size='large' alt={board.name}></Avatar>
          </div>
        </Flex>

        <div className='board-settings-subheader'>{t("BOARD_SETTINGS_GENERAL_NAME_HEADER")}</div>
        <DefaultInput
          onBlur={(e) => this.updateBoardName(e)}
          value={board.name}
          style={{ height: '32px' }}>
        </DefaultInput>

        <div className='board-settings-subheader'>{t("BOARD_SETTINGS_GENERAL_TYPE_HEADER")}</div>
        <Flex direction='row' grow={0} className='board-creation-type'>
          <Flex onClick={() => this.updateBoardType(0)} className={`board-creation-type-option${type === 0 ? ' board-creation-type-option-active' : ''}`} align='center' direction='column'>
            <Flex className='board-creation-type-option-display' align='center'>
              <h2 className='board-creation-type-option-header'>{t("FREEPLACE")}</h2>
              <img alt='Freeplace' src='./../../../assets/icons/freeplace.svg' width='128' height='128'></img>
            </Flex>
            <div className='board-creation-type-option-desc'>{t("FREEPLACE_DESCRIPTION")}</div>
          </Flex>

          <Flex onClick={() => this.updateBoardType(1)} className={`board-creation-type-option${type === 1 ? ' board-creation-type-option-active' : ''}`}  align='center' direction='column'>
            <Flex className='board-creation-type-option-display' align='center'>
              <h2 className='board-creation-type-option-header'>{t("GRID")}</h2>
              <img alt='Grid' src='./../../../assets/icons/snaptogrid.svg' width='128' height='128'></img>
            </Flex>
            <div className='board-creation-type-option-desc'>{t("GRID_DESCRIPTION")}</div>
          </Flex>
        </Flex>

        <Flex direction='row' grow={0} className='board-settings-subheader'>
          {t("BOARD_SETTINGS_GENERAL_AUTO_RESIZE")}
          <ToggleSwitch onChange={(resize) => this.updateBoardResize(resize)} small={true} style={{ marginLeft: '24px' }} />
        </Flex>
      </Flex>
    );
  }
}

export default withTranslation()(connect(mapStateToProps, null)(GeneralSettingsScreen));

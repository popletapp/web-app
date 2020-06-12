import React from 'react';
import Modal from './Modal';
import { DefaultInput, Flex, Button, ColorPicker, FlexChild, Input } from '../..';
import { connect } from 'react-redux';
import Poplet from '../../..';
import { switchBoard, joinBoard, checkInvite } from '../../../modules';
import './Modal.scss';
import { withTranslation } from 'react-i18next';

function mapStateToProps (state, props) {
  return {
    group: state.groupsByBoard[props.boardID][props.groupID]
  }
}

class GroupSettingsModal extends Modal {
  constructor ({ boardID, groupID, location }) {
    super();
    this.state = {
      name: '',
      type: 0,
      error: null
    };
    this.boardID = boardID;
    this.groupID = groupID;
    this.location = location;
  }

  check ({ name }) {
    let { t } = this.props;
    if (!name) {
      throw new Error(t("BOARD_CREATION_NAME_REQUIRED"));
    } else if (name.length < 2) {
      throw new Error(t("BOARD_CREATION_NAME_TOO_SHORT"));
    } else if (name.length > 64) {
      throw new Error(t("BOARD_CREATION_NAME_TOO_LONG"));
    } else {
      return null;
    }
  }

  handleColorChange () {

  }

  render () {
    const { group, t } = this.props;
    const { error, type } = this.state;
    if (!group) return null;
    return (
      <div>
        <div className='modal-content'>
          <div className='modal-header'>
            {t("MODAL_GROUP_SETTINGS_TITLE")}
          </div>
          <div className='modal-body'>
            <p className='modal-error'>{error}</p>

            <Flex direction='row'>
              <FlexChild>
                <div className='modal-note-settings-header'>{t("GROUP_SETTINGS_GROUP_NAME_HEADER")}</div>
                <Input onChange={(e) => this.onChange(e)}>{group.name}</Input>
              </FlexChild>    
              <br />
              <FlexChild>
                <div className='modal-note-settings-header'>{t("GROUP_SETTINGS_GROUP_COLOR_HEADER")}</div>
                <ColorPicker
                  color={group.options ? group.options.color : '#546e7a'}
                  onChangeComplete={(color) => this.handleColorChange(color)}
                />
              </FlexChild>
            </Flex>

            <br />
            <div className='modal-note-settings-header'>{t("GROUP_SETTINGS_GROUP_TYPE_HEADER")}</div>
            <Flex direction='row' className='board-creation-type'>
              <Flex onClick={() => this.setState({ type: 0 })} className={`board-creation-type-option${type === 0 ? ' board-creation-type-option-active' : ''}`} align='center' direction='column'>
                <Flex className='board-creation-type-option-display' align='center'>
                  <h2 className='board-creation-type-option-header'>{t("FREEPLACE")}</h2>
                  <img src='./../../../assets/icons/freeplace.svg' width='128' height='128'></img>
                </Flex>
                <div className='board-creation-type-option-desc'>{t("FREEPLACE_DESCRIPTION")}</div>
              </Flex>

              <Flex onClick={() => this.setState({ type: 1 })} className={`board-creation-type-option${type === 1 ? ' board-creation-type-option-active' : ''}`}  align='center' direction='column'>
                <Flex className='board-creation-type-option-display' align='center'>
                  <h2 className='board-creation-type-option-header'>{t("GRID")}</h2>
                  <img src='./../../../assets/icons/snaptogrid.svg' width='128' height='128'></img>
                </Flex>
                <div className='board-creation-type-option-desc'>{t("GRID_DESCRIPTION")}</div>
              </Flex>
            </Flex>
          </div>
        </div>
        <Flex className='modal-footer' direction='row' justify='end' align='right'>
          <Button onClick={(e) => this.actionMade('cancel', e)} 
          className='modal-close btn modal-cancel'>{this.props.cancelText || t("MODAL_GENERIC_CANCEL_CLOSE")}</Button>
          <Button onClick={(e) => this.actionMade('confirm', e)} 
          className='modal-close btn modal-confirm'>{this.props.confirmText || t("MODAL_GENERIC_SAVE")}</Button>
        </Flex>
      </div>
    );
  }
}

export default withTranslation()(connect(mapStateToProps, null)(GroupSettingsModal));

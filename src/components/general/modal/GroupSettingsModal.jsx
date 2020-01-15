import React from 'react';
import Modal from './Modal';
import { DefaultInput, Flex, Button } from '../..';
import Poplet from '../../..';
import { switchBoard, joinBoard, checkInvite } from '../../../modules';
import './Modal.scss';
import * as errors from '../../../constants/ErrorMessages.js';

class GroupSettingsModal extends Modal {
  constructor ({ location }) {
    super();
    this.state = {
      name: '',
      error: null
    };
    this.location = location;
  }

  async check ({ code }) {
    const invite = await checkInvite(code);
    if (!invite) {
      throw new Error(errors.BOARD_JOIN_INVITE_LINK_INVALID);
    } else if (code.length < 2) {
      throw new Error(errors.BOARD_JOIN_INVITE_LINK_UNAUTHORIZED);
    } else {
      return null;
    }
  }

  async apply () {
    const { code } = this.state;
    const error = await this.check({ code });
    if (!error) {
      const board = await joinBoard(code, Poplet.user.id);
      if (board) {
        await switchBoard(board.id);
      }
    } else {
      this.setState({ error });
    }
  }

  cancel () {

  }

  onChange (event) {

  }

  render () {
    return (
      <div>
        <div className='modal-content'>
          <div className='modal-header'>
            Group Settings
          </div>
          <div className='modal-body'>
            <div className='modal-note-settings-header'>Group Name</div>
            <DefaultInput onChange={(e) => this.onChange(e)} placeholder='Code' />
            <br />
            <div className='modal-note-settings-header'>Group Color</div>
            <DefaultInput onChange={(e) => this.onChange(e)} placeholder='Code' />
            <br />
            <div className='modal-note-settings-header'>Group Type</div>
            <Flex direction='row' className='board-creation-type'>
              <Flex className='board-creation-type-option' align='center' direction='column'>
                <Flex className='board-creation-type-option-display' align='center'>
                  <h2 className='board-creation-type-option-header'>Freeplace</h2>
                  <img src='./../../../assets/icons/freeplace.svg' width='128' height='128'></img>
                </Flex>
                <div className='board-creation-type-option-desc'>Freeplace allows you to place notes without restrictions in any position</div>
              </Flex>

              <Flex className='board-creation-type-option' align='center' direction='column'>
                <Flex className='board-creation-type-option-display' align='center'>
                  <h2 className='board-creation-type-option-header'>Grid</h2>
                  <img src='./../../../assets/icons/snaptogrid.svg' width='128' height='128'></img>
                </Flex>
                <div className='board-creation-type-option-desc'>Snap to Grid means all notes/groups can only be placed on grid lines</div>
              </Flex>
            </Flex>
          </div>
        </div>
        <Flex className='modal-footer' direction='row' justify='end' align='right'>
          <Button onClick={(e) => this.handleEvent(e, 'cancel')} className='modal-close btn modal-cancel'>{this.props.cancelText || 'Close'}</Button>
          <Button onClick={(e) => this.handleEvent(e, 'confirm')} className='modal-close btn modal-confirm'>{this.props.confirmText || 'Save'}</Button>
        </Flex>
      </div>
    );
  }
}

export default GroupSettingsModal;

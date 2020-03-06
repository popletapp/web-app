import React from 'react';
import Modal from './Modal';
import { DefaultInput, Flex, Button } from '../../';
import Poplet from './../../../';
import { switchBoard, joinBoard, checkInvite } from '../../../modules';
import './Modal.scss';
import { Messages } from './../../../i18n';

class BoardJoinModal extends Modal {
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
      throw new Error(Messages.BOARD_JOIN_INVITE_LINK_INVALID);
    } else if (code.length < 2) {
      throw new Error(Messages.BOARD_JOIN_INVITE_LINK_UNAUTHORIZED);
    } else {
      return null;
    }
  }

  handleEvent (event, type) {
    if (type === 'confirm') {
      try {
        this.create();
        this.actionMade();
      } catch (err) {
        event.preventDefault();
        this.setState({ error: err.message });
      }
    } else if (type === 'cancel') {
      this.actionMade();
      event.preventDefault();
    } else {
      const code = event.target.value;
      this.setState({
        code,
        error: null
      });
      this.check({ code })
        .catch(err => {
          this.setState({
            code,
            error: err.message
          });
        });
    }
  }

  async create () {
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

  render () {
    return (
      <div>
        <div className='modal-content'>
          <div className='modal-header'>
            {Messages.JOIN_A_BOARD}
          </div>
          <div className='modal-body'>
            <p>{Messages.MODAL_JOIN_BOARD_BODY_LINE_1}</p>
            <p className='modal-error'>{this.state.error}</p>
            <DefaultInput onChange={(e) => this.handleEvent(e, 'input')} placeholder='Code' />
          </div>
        </div>
        <Flex className='modal-footer' direction='row' justify='end' align='right'>
          <Button onClick={(e) => this.handleEvent(e, 'cancel')} className='modal-close btn modal-cancel'>{this.props.cancelText || Messages.MODAL_GENERIC_CANCEL}</Button>
          <Button onClick={(e) => this.handleEvent(e, 'confirm')} className='modal-close btn modal-confirm'>{this.props.confirmText || Messages.MODAL_JOIN_BOARD_JOIN}</Button>
        </Flex>
      </div>
    );
  }
}

export default BoardJoinModal;

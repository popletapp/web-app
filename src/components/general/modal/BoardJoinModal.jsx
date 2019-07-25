import React from 'react';
import Modal from './Modal';
import Input from '../input/Input.jsx';
import Poplet from './../../../';
import { switchBoard, joinBoard, checkInvite } from '../../../modules';
import './Modal.scss';
import * as errors from '../../../constants/ErrorMessages.js';

class BoardJoinModal extends Modal {
  constructor () {
    super();
    this.state = {
      name: '',
      error: null
    };
  }

  async check ({ code }) {
    const invite = await checkInvite(code);
    console.log(invite);
    if (!invite) {
      throw new Error(errors.BOARD_JOIN_INVITE_LINK_INVALID);
    } else if (code.length < 2) {
      throw new Error(errors.BOARD_JOIN_INVITE_LINK_UNAUTHORIZED);
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
      const code = event.target.innerText;
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
    const error = this.check({ code });
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
      <div className='modal poplet-modal fadeInZoomOut' style={{ display: 'block' }}>
        <div className='modal-content'>
          <div className='modal-header'>
            Join a Board
          </div>
          <div className='modal-body'>
            <p>Enter an invite code below:</p>
            <p className='modal-error'>{this.state.error}</p>
            <Input onInput={(e) => this.handleEvent(e, 'input')} placeholder='Code' />
          </div>
        </div>
        <div className='modal-footer'>
          <button onClick={(e) => this.handleEvent(e, 'cancel')} className='modal-close waves-effect waves-white btn-flat grey'>{this.props.cancelText || 'Cancel'}</button>
          <button onClick={(e) => this.handleEvent(e, 'confirm')} className='modal-close waves-effect waves-white btn-flat green'>{this.props.confirmText || 'Join'}</button>
        </div>
      </div>
    );
  }
}

export default BoardJoinModal;

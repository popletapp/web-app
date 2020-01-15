import React from 'react';
import Modal from './Modal';
import { Input, Flex } from './../..';
import { switchBoard, createBoard } from './../../../modules';
import './Modal.scss';
import * as errors from './../../../constants/ErrorMessages.js';

class BoardCreationModal extends Modal {
  constructor () {
    super();
    this.state = {
      name: '',
      error: null
    };
  }

  check ({ name }) {
    if (!name) {
      throw new Error(errors.BOARD_CREATE_NAME_REQUIRED);
    } else if (name.length < 2) {
      throw new Error(errors.BOARD_CREATE_NAME_TOO_SHORT);
    } else if (name.length > 64) {
      throw new Error(errors.BOARD_CREATE_NAME_TOO_LONG);
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
      const name = event.target.innerText;
      this.setState({
        name,
        error: null
      });
      try {
        this.check({ name });
      } catch (err) {
        this.setState({
          name,
          error: err.message
        });
      }
    }
  }

  async create () {
    const { name } = this.state;
    const error = this.check({ name });
    if (!error) {
      const board = await createBoard({ name });
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
            Create New Board
          </div>
          <div className='modal-body'>
            <div className='board-creation-header'>Board Name</div>
            <p className='modal-error'>{this.state.error}</p>
            <Input onInput={(e) => this.handleEvent(e, 'input')} placeholder='Board Name' />
            <br />
            <div className='board-creation-header'>Board Type</div>
            <Flex direction='row' className='board-creation-type'>
              <Flex className='board-creation-type-option' align='center' direction='column'>
                <Flex className='board-creation-type-option-display' align='center'>
                  <h2 className='board-creation-type-option-header'>Freeplace</h2>
                  <img alt='Freeplace' src='./../../../assets/icons/freeplace.svg' width='128' height='128'></img>
                </Flex>
                <div className='board-creation-type-option-desc'>Freeplace allows you to place notes without restrictions in any position</div>
              </Flex>

              <Flex className='board-creation-type-option' align='center' direction='column'>
                <Flex className='board-creation-type-option-display' align='center'>
                  <h2 className='board-creation-type-option-header'>Grid</h2>
                  <img alt='Grid' src='./../../../assets/icons/snaptogrid.svg' width='128' height='128'></img>
                </Flex>
                <div className='board-creation-type-option-desc'>Snap to Grid means all notes/groups can only be placed on grid lines</div>
              </Flex>
            </Flex>
          </div>
        </div>
        <div className='modal-footer'>
          <button onClick={(e) => this.handleEvent(e, 'cancel')} className='modal-close btn modal-cancel'>{this.props.cancelText || 'Cancel'}</button>
          <button onClick={(e) => this.handleEvent(e, 'confirm')} className='modal-close btn modal-confirm'>{this.props.confirmText || 'OK'}</button>
        </div>
      </div>
    );
  }
}

export default BoardCreationModal;

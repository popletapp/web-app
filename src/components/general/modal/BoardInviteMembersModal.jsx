import React from 'react';
import Modal from './Modal';
import Input from '../input/DefaultInput.jsx';
import { createInvite } from '../../../modules';
import './Modal.scss';

class BoardCreationModal extends Modal {
  constructor ({ boardID }) {
    super();
    this.state = {
      name: '',
      error: null
    };
    this.boardID = boardID;
  }

  async create () {
    const invite = await createInvite(this.boardID);
    this.setState({ invite: invite.code });
  }

  async componentDidMount () {
    await this.create();
  }

  render () {
    return (
      <div>
        <div className='modal-content'>
          <div className='modal-header'>
            Invite people to your board!
          </div>
          <div className='modal-body'>
            <p>Share the code below with people you want to join your board.</p>
            <Input value={this.state.invite}></Input>
            <p>They can enter this code into the "Join a Board" screen.</p>
          </div>
        </div>
        <div className='modal-footer'>
          <button onClick={(e) => this.close()} className='modal-close btn modal-cancel'>{this.props.cancelText || 'Close'}</button>
        </div>
      </div>
    );
  }
}

export default BoardCreationModal;

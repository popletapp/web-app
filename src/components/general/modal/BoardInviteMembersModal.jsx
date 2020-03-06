import React from 'react';
import Modal from './Modal';
import Input from '../input/DefaultInput.jsx';
import { createInvite } from '../../../modules';
import { Messages } from './../../../i18n';
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
            {Messages.MODAL_INVITE_MEMBERS_TITLE}
          </div>
          <div className='modal-body'>
            <p>{Messages.MODAL_INVITE_MEMBERS_BODY_LINE_1}</p>
            <Input value={this.state.invite}></Input>
            <p>{Messages.MODAL_INVITE_MEMBERS_BODY_LINE_2}</p>
          </div>
        </div>
        <div className='modal-footer'>
          <button onClick={(e) => this.close()} className='modal-close btn modal-cancel'>{this.props.cancelText || Messages.MODAL_GENERIC_CANCEL_CLOSE}</button>
        </div>
      </div>
    );
  }
}

export default BoardCreationModal;

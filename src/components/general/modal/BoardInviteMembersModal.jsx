import React from 'react';
import Modal from './Modal';
import Input from '../input/DefaultInput.jsx';
import { createInvite } from '../../../modules';
import { withTranslation } from 'react-i18next';
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
    const { t } = this.props;
    return (
      <div>
        <div className='modal-content'>
          <div className='modal-header'>
            {t("MODAL_INVITE_MEMBERS_TITLE")}
          </div>
          <div className='modal-body'>
            <p>{t("MODAL_INVITE_MEMBERS_BODY_LINE_1")}</p>
            <Input value={this.state.invite}></Input>
            <p>{t("MODAL_INVITE_MEMBERS_BODY_LINE_2")}</p>
          </div>
        </div>
        <div className='modal-footer'>
          <button onClick={(e) => this.close()} className='modal-close btn modal-cancel'>{this.props.cancelText || t("MODAL_GENERIC_CANCEL_CLOSE")}</button>
        </div>
      </div>
    );
  }
}

export default withTranslation()(BoardCreationModal);

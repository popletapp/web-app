import React from 'react';
import Modal from './Modal';
import { createInvite } from '../../../modules';
import { withTranslation } from 'react-i18next';
import './Modal.scss';

class BoardInviteMembersModal extends Modal {
  constructor ({ boardID }) {
    super();
    this.state = {
      name: '',
      error: null,
      invite: 'generating...'
    };
    this.boardID = boardID;
  }

  async componentDidMount () {
    const invite = await createInvite(this.boardID);
    this.setState({ invite: invite.code });
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
            <input className='text-input' value={this.state.invite} readOnly></input>
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

export default withTranslation()(BoardInviteMembersModal);

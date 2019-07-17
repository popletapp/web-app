import React, { Component } from 'react';
import { Modal as ModalRenderer } from '../../../modules';
import './Modal.scss';

class Modal extends Component {
  constructor () {
    super();
    this.state = {};
  }

  actionMade (type) {
    new ModalRenderer().obliterate();
    if (type) {
      if (type === 'cancel') {
        return this.props.onCancel();
      } else {
        return this.props.onConfirm(this.state);
      }
    }
  }

  render () {
    return (
      <div className="modal poplet-modal" style={{ display: 'block' }}>
        <div className="modal-content">
          <h4>{this.props.title}</h4>
          <p>{this.props.content}</p>
        </div>
        <div className="modal-footer">
          <button onClick={() => this.actionMade('cancel')} className="modal-close waves-effect waves-white btn-flat grey">{this.props.cancelText || 'Cancel'}</button>
          <button onClick={() => this.actionMade('confirm')} className="modal-close waves-effect waves-white btn-flat green">{this.props.confirmText || 'OK'}</button>
        </div>
      </div>
    );
  }
}

export default Modal;

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { popModal } from './../../../modules';
import { Flex, FlexChild } from './../../';
import './Modal.scss';

class Modal extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.listener = (e) => e.keyCode === 27 && this.actionMade('cancel', e);
    document.addEventListener('keydown', this.listener, false);
  }

  actionMade (type, event) {
    const { onCancel, onConfirm = () => {} } = this.props;
    this.close();
    if (type) {
      if (type === 'cancel' && onCancel) {
        return onCancel();
      } else {
        return onConfirm(this.state);
      }
    }
  }

  close () {
    popModal();
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.listener, false);
  }

  render () {
    const { children: customModal, title, content, cancelText, confirmText } = this.props;
    return (
      <div>
        <div className='modal' aria-labelledby='modal-title' aria-describedby='modal-content'>
          {(() => {
            if (customModal && customModal.modal) {
              return customModal.modal;
            } else {
              return (<div>
                <Flex className="modal-content">
                  <FlexChild align='left' direction='row'>
                    <h4>{title}</h4>
                    <Flex onClick={() => this.close()} align='right' justify='right' direction='column'>
                      <i className='material-icons'>close</i>
                      Close
                    </Flex>
                  </FlexChild>

                  <p>{content}</p>
                </Flex>
                <div className="modal-footer">
                  <button onClick={(e) => this.actionMade('cancel', e)} className="modal-close btn modal-cancel">{cancelText || 'Cancel'}</button>
                  <button onClick={(e) => this.actionMade('confirm', e)} className="modal-close btn modal-confirm">{confirmText || 'OK'}</button>
                </div>
              </div>);
            }
          })()}
        </div>
      </div>
    );
  }
}

const ModalRouter = withRouter(Modal);
export default Modal;
export { ModalRouter };

import React from 'react';
import Modal from './Modal';
import { Flex, Button } from '../..';
import './Modal.scss';

class ConfirmModal extends Modal {
  render () {
    const { title, content } = this.props;
    return (
      <div>
        <div className='modal-content'>
          <div className='modal-header'>
            {title}
          </div>
          <div className='modal-body'>
            {content}
          </div>
        </div>
        <Flex className='modal-footer' direction='row' justify='end' align='right'>
          <Button onClick={(e) => this.actionMade('confirm', e)} className='btn modal-confirm'>{this.props.confirmText || 'Yes'}</Button>
          <Button onClick={(e) => this.close('cancel', e)} className='modal-cancel btn'>{this.props.cancelText || 'No'}</Button>
        </Flex>
      </div>
    );
  }
}

export default ConfirmModal;

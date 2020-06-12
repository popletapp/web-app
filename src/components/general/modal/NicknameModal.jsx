import React from 'react';
import Modal from './Modal';
import { Flex, Button, DefaultInput } from '../..';
import './Modal.scss';

class NicknameModal extends Modal {
  confirm (e) {
    const { onConfirm = () => void 0 } = this.props;
    if (typeof onConfirm === 'function') {
      onConfirm();
    }
    this.actionMade('confirm', e);
  }

  render () {
    const { member } = this.props;
    return (
      <div>
        <div className='modal-content'>
          <div className='modal-header'>
            Change nickname
          </div>
          <div className='modal-body'>
            <DefaultInput value={member.nickname || member.username} />
          </div>
        </div>
        <Flex className='modal-footer' direction='row' justify='end' align='right'>
          <Button onClick={(e) => this.confirm(e)} className='btn modal-confirm'>Confirm</Button>
          {!this.props.cancelText && <Button onClick={(e) => this.close('cancel', e)} className='modal-cancel btn'>Cancel</Button>}
        </Flex>
      </div>
    );
  }
}

export default NicknameModal;

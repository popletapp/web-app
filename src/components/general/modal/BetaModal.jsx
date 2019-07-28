import React from 'react';
import Modal from './Modal';
import { Flex, Button } from '../../';
import './Modal.scss';

class BoardJoinModal extends Modal {
  render () {
    return (
      <div>
        <div className='modal-content'>
          <div className='modal-header'>
            Info
          </div>
          <div className='modal-body'>
            <p>Hey! Thanks for participating in the Poplet public beta.<br />This is one big reminder that Poplet is in an extremely developmental state; downtime, bugs or data loss is possible.</p>
          </div>
        </div>
        <Flex className='modal-footer' direction='row' justify='end' align='right'>
          <Button onClick={(e) => this.close()} className='modal-close btn modal-confirm'>{this.props.confirmText || 'Okay'}</Button>
        </Flex>
      </div>
    );
  }
}

export default BoardJoinModal;

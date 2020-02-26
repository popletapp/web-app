import React from 'react';
import Modal from './Modal';
import { Flex, Button } from '../../';
import './Modal.scss';

class BetaModal extends Modal {
  render () {
    return (
      <div>
        <div className='modal-content'>
          <div className='modal-header'>
            Info
          </div>
          <div className='modal-body'>
            <p>Hey! Thanks for participating in the Poplet public beta.<br />Poplet is still under heavy development. Downtime, bugs or data loss may occur.</p>
          </div>
        </div>
        <Flex className='modal-footer' direction='row' justify='end' align='right'>
          <Button onClick={(e) => this.close()} className='modal-close btn modal-confirm'>{this.props.confirmText || 'Okay'}</Button>
        </Flex>
      </div>
    );
  }
}

export default BetaModal;

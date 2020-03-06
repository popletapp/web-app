import React from 'react';
import Modal from './Modal';
import { Flex, Button } from '../../';
import './Modal.scss';
import { Messages } from './../../../i18n';

class BetaModal extends Modal {
  render () {
    return (
      <div>
        <div className='modal-content'>
          <div className='modal-header'>
            {Messages.MODAL_BETA_TITLE}
          </div>
          <div className='modal-body'>
            <p>{Messages.MODAL_BETA_BODY_LINE_1}<br />{Messages.MODAL_BETA_BODY_LINE_2}</p>
          </div>
        </div>
        <Flex className='modal-footer' direction='row' justify='end' align='right'>
          <Button onClick={(e) => this.close()} className='modal-close btn modal-confirm'>{this.props.confirmText || Messages.MODAL_BETA_CONFIRM}</Button>
        </Flex>
      </div>
    );
  }
}

export default BetaModal;

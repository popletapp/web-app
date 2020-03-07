import React from 'react';
import Modal from './Modal';
import { Flex, Button } from '../../';
import './Modal.scss';
import { withTranslation } from 'react-i18next';

class BetaModal extends Modal {
  render () {
    const { t } = this.props;
    return (
      <div>
        <div className='modal-content'>
          <div className='modal-header'>
            {t("MODAL_BETA_TITLE")}
          </div>
          <div className='modal-body'>
            <p>{t("MODAL_BETA_BODY_LINE_1")}<br />{t("MODAL_BETA_BODY_LINE_2")}</p>
          </div>
        </div>
        <Flex className='modal-footer' direction='row' justify='end' align='right'>
          <Button onClick={(e) => this.close()} className='modal-close btn modal-confirm'>{this.props.confirmText || t("MODAL_BETA_CONFIRM")}</Button>
        </Flex>
      </div>
    );
  }
}

export default withTranslation()(BetaModal);

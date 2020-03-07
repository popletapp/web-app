import React from 'react';
import Modal from './Modal';
import { Input, Flex } from './../..';
import { switchBoard, createBoard } from './../../../modules';
import './Modal.scss';
import { withTranslation } from 'react-i18next';

class BoardCreationModal extends Modal {
  constructor () {
    super();
    this.state = {
      name: '',
      type: 0,
      error: null
    };
  }

  check ({ name }) {
    const { t } = this.props;
    if (!name) {
      throw new Error(t("BOARD_CREATION_NAME_REQUIRED"));
    } else if (name.length < 2) {
      throw new Error(t("BOARD_CREATION_NAME_TOO_SHORT"));
    } else if (name.length > 64) {
      throw new Error(t("BOARD_CREATION_NAME_TOO_LONG"));
    } else {
      return null;
    }
  }

  handleEvent (event, type) {
    if (type === 'confirm') {
      try {
        this.create();
        this.actionMade();
      } catch (err) {
        event.preventDefault();
        this.setState({ error: err.message });
      }
    } else if (type === 'cancel') {
      this.actionMade();
      event.preventDefault();
    } else {
      const name = event.target.innerText;
      this.setState({
        name,
        error: null
      });
      try {
        this.check({ name });
      } catch (err) {
        this.setState({
          name,
          error: err.message
        });
      }
    }
  }

  async create () {
    const { name, type } = this.state;
    const error = this.check({ name });
    if (!error) {
      const board = await createBoard({ name, type });
      if (board) {
        await switchBoard(board.id);
      }
    } else {
      this.setState({ error });
    }
  }

  render () {
    const { t } = this.props;
    const { type, error } = this.state;
    return (
      <div>
        <div className='modal-content'>
          <div className='modal-header'>
            {t("MODAL_BOARD_CREATION_TITLE")}
          </div>
          <div className='modal-body'>
            <div className='board-creation-header'>{t("MODAL_BOARD_CREATION_BOARD_NAME_HEADER")}</div>
            <p className='modal-error'>{error}</p>
            <Input onInput={(e) => this.handleEvent(e, 'input')} placeholder='Board Name' />
            <br />
            <div className='board-creation-header'>{t("MODAL_BOARD_CREATION_BOARD_TYPE_HEADER")}</div>
            <Flex direction='row' className='board-creation-type'>
              <Flex onClick={() => this.setState({ type: 0 })} className={`board-creation-type-option${type === 0 ? ' board-creation-type-option-active' : ''}`} align='center' direction='column'>
                <Flex className='board-creation-type-option-display' align='center'>
                  <h2 className='board-creation-type-option-header'>{t("FREEPLACE")}</h2>
                  <img alt='Freeplace' src='./../../../assets/icons/freeplace.svg' width='128' height='128'></img>
                </Flex>
                <div className='board-creation-type-option-desc'>{t("FREEPLACE_DESCRIPTION")}</div>
              </Flex>

              <Flex onClick={() => this.setState({ type: 1 })} className={`board-creation-type-option${type === 1 ? ' board-creation-type-option-active' : ''}`}  align='center' direction='column'>
                <Flex className='board-creation-type-option-display' align='center'>
                  <h2 className='board-creation-type-option-header'>{t("GRID")}</h2>
                  <img alt='Grid' src='./../../../assets/icons/snaptogrid.svg' width='128' height='128'></img>
                </Flex>
                <div className='board-creation-type-option-desc'>{t("GRID_DESCRIPTION")}</div>
              </Flex>
            </Flex>
          </div>
        </div>
        <div className='modal-footer'>
          <button onClick={(e) => this.handleEvent(e, 'cancel')} className='modal-close btn modal-cancel'>{this.props.cancelText || t("MODAL_GENERIC_CANCEL")}</button>
          <button onClick={(e) => this.handleEvent(e, 'confirm')} className='modal-close btn modal-confirm'>{this.props.confirmText || t("MODAL_GENERIC_CONFIRM")}</button>
        </div>
      </div>
    );
  }
}

export default withTranslation()(BoardCreationModal);

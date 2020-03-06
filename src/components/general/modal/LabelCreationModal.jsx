import React from 'react';
import Modal from './Modal';
import { Flex, Button, DefaultInput, ColorPicker } from '../..';
import { addLabel } from './../../../modules';
import './Modal.scss';
import { Messages } from '../../../i18n';

class LabelCreationModal extends Modal {
  constructor () {
    super();
    this.state = {
      name: '',
      error: null
    };
  }

  check () {
    const { name } = this.state;
    this.setState({ error: null })
    if (name < 1) {
      return Messages.LABEL_NAME_REQUIRED;
    }
    if (name > 32) {
      return Messages.LABEL_NAME_TOO_LONG;
    }
    return null;
  }

  async createLabel () {
    const { boardID } = this.props;
    const { name, color } = this.state;
    const error = this.check();
    if (error) {
      this.setState({ error })
      return null;
    }
    this.actionMade('confirm');
    await addLabel(boardID, { name, color })
  }

  handleNameChange (event) {
    const name = event.target.value;
    this.setState({ name });
    const error = this.check();
    if (error) {
      this.setState({ error })
      return null;
    }
  }

  handleColorChange (color) {
    this.setState({ color: color.hex });
  }

  render () {
    return (
      <div>
        <div className='modal-content'>
          <div className='modal-header'>
            {Messages.MODAL_LABEL_CREATION_TITLE}
          </div>
          
          <div className='modal-body'>
            <p className='modal-error'>{this.state.error}</p>
            <header>{Messages.MODAL_LABEL_CREATION_LABEL_NAME_HEADER}</header>
            <DefaultInput onChange={(e) => this.handleNameChange(e)} />

            <header>{Messages.MODAL_LABEL_CREATION_LABEL_COLOR_HEADER}</header>
            <ColorPicker
              color={this.state.color || '#ffffff'}
              onChangeComplete={(color) => this.handleColorChange(color)}
            />
          </div>
        </div>
        <Flex className='modal-footer' direction='row' justify='end' align='right'>
          <Button onClick={(e) => this.createLabel()} className='btn modal-confirm'>{Messages.MODAL_GENERIC_CONFIRM_DONE}</Button>
          <Button onClick={(e) => this.close('cancel', e)} className='modal-cancel btn'>{Messages.MODAL_GENERIC_CANCEL}</Button>
        </Flex>
      </div>
    );
  }
}

export default LabelCreationModal;

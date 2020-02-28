import React from 'react';
import Modal from './Modal';
import { Flex, Button, DefaultInput, ColorPicker } from '../..';
import { addLabel } from './../../../modules';
import * as errors from '../../../constants/ErrorMessages.js';
import './Modal.scss';

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
      return errors.LABEL_NAME_REQUIRED;
    }
    if (name > 32) {
      return errors.LABEL_NAME_TOO_LONG;
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
            New Label
          </div>
          
          <div className='modal-body'>
            <p className='modal-error'>{this.state.error}</p>
            <header>Name</header>
            <DefaultInput onChange={(e) => this.handleNameChange(e)} />

            <header>Color</header>
            <ColorPicker
              color={this.state.color || '#ffffff'}
              onChangeComplete={(color) => this.handleColorChange(color)}
            />
          </div>
        </div>
        <Flex className='modal-footer' direction='row' justify='end' align='right'>
          <Button onClick={(e) => this.createLabel()} className='btn modal-confirm'>Done</Button>
          <Button onClick={(e) => this.close('cancel', e)} className='modal-cancel btn'>Cancel</Button>
        </Flex>
      </div>
    );
  }
}

export default LabelCreationModal;

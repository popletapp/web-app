import React, { Component } from 'react';
import './Input.scss';

class DefaultInput extends Component {
  constructor ({ name, type, placeholder, value }) {
    super();
    this.name = name;
    this.type = type;
    this.placeholder = placeholder || '';
    this.value = value;
    this.state = {};
  }

  render () {
    const { name, type, placeholder, value, children, onChange, onInput } = this.props;
    return (
      <input className='text-input'
        name={name || 'input'}
        spellCheck='false'
        type={type || 'text'}
        placeholder={placeholder || ''}
        maxLength='999'
        defaultValue={value || ''}
        onInput={onInput}
        onChange={onChange}>
        {children || null}
      </input>
    );
  }
}

export default DefaultInput;

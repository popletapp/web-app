import React, { Component } from 'react';
import { joinClasses } from '../../../util';
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
    const { name, type, placeholder, value, children, onChange, onInput, className, onBlur } = this.props;
    return (
      <input
        className={joinClasses('text-input', className)}
        name={name || 'input'}
        spellCheck='false'
        type={type || 'text'}
        placeholder={placeholder || ''}
        maxLength='999'
        defaultValue={value || ''}
        onInput={onInput}
        onBlur={onBlur}
        onChange={onChange}>
        {children || null}
      </input>
    );
  }
}

export default DefaultInput;

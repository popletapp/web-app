import React, { Component } from 'react';
import { joinClasses } from '../../../util';
import './Input.scss';

class DefaultInput extends Component {
  constructor ({ value }) {
    super();
    this.state = {
      value
    }
  }

  onChange (event) {
    const { onChange } = this.props;
    this.setState({ value: event.target.value });
    if (typeof onChange === 'function') {
      onChange(event);
    }
  }

  render () {
    const { name, type, placeholder, children, onInput, className, onBlur } = this.props;
    const { value } = this.state;
    return (
      <input
        className={joinClasses('text-input', className)}
        name={name || 'input'}
        spellCheck='false'
        type={type || 'text'}
        placeholder={placeholder || ''}
        maxLength='999'
        value={value || ''}
        onInput={onInput}
        onBlur={onBlur}
        onChange={(e) => this.onChange(e)}>
        {children || null}
      </input>
    );
  }
}

export default DefaultInput;

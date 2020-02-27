import React, { Component } from 'react';
import './Button.scss';

class Button extends Component {
  constructor ({ text, color }) {
    super();
    this.text = text;
    this.color = color;
  }

  render () {
    const { icon } = this.props;
    return (
      <button {...this.props} className={`btn-small${this.color ? ` ${this.color}` : ''}${this.props.className ? ` ${this.props.className}` : ''}`}>
        {this.text || this.props.children}
        {icon && <i className="material-icons">{icon}</i>}
      </button>
    );
  }
}

export default Button;

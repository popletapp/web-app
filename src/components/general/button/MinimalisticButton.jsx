import React, { Component } from 'react';
import './Button.scss';

class MinimalisticButton extends Component {
  constructor ({ icon, small }) {
    super();
    this.icon = icon || 'add';
    this.small = small || false;
  }

  render () {
    const { icon, className } = this.props;
    const dontInclude = ['small', 'icon', 'color', 'label'];
    return (
      <button {...Object.fromEntries(Object.entries(this.props).filter(item => !dontInclude.includes(item[0])))}
        className={`minimalistic-button${className && ` ${className}`}`}>
        <i className="material-icons">{icon}
        </i>
      </button>
    );
  }
}

export default MinimalisticButton;

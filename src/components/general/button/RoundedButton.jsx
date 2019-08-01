import React, { Component } from 'react';
import './Button.scss';

class RoundedButton extends Component {
  render () {
    const { small, icon, color, label, onClick } = this.props;
    return (
      <div className='btn-floating-container'>
        <div className='floating-btn-button'>
          <button
            onClick={onClick}
            className={`${small ? 'btn-small' : ''} btn-floating ${color}`}>
            <i className="material-icons">{icon}</i>
          </button>
        </div>
        {label && <div className='center floating-btn-label'><label>{label}</label></div>}
      </div>
    );
  }
}

export default RoundedButton;

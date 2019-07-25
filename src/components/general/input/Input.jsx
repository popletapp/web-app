import React, { Component } from 'react';
import './Input.scss';

class Input extends Component {
  constructor ({ icon, prefixIcon = false, placeholder }) {
    super();
    this.icon = icon;
    this.prefixIcon = prefixIcon;
    this.placeholder = placeholder || '';
    this.state = {};
  }

  render () {
    const { icon, prefixIcon, className } = this.props;
    const dontInclude = ['prefixIcon'];
    return <div className={`${className} text-input-container`}>
      {icon && prefixIcon &&
              <div className='input-icon'>
                <i className='material-icons'>{icon}</i>
              </div>
      }
      <div
        {...Object.fromEntries(Object.entries(this.props).filter(item => !dontInclude.includes(item[0])))}
        className='text-input'
        contentEditable='true'
        suppressContentEditableWarning={true}
        role='textbox'
        spellCheck='false'
        style={{ outline: 'none', userSelect: 'text', whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>{this.props.children || ''}
      </div>
      {icon && !prefixIcon &&
        <div className='input-icon'>
          <i className='material-icons'>{icon}</i>
        </div>}
    </div>;
  }
}

export default Input;

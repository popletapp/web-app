import React, { Component } from 'react';
import { joinClasses } from '../../../util';
import './Input.scss';

class Input extends Component {
  render () {
    const { icon, prefixIcon, className, onClick, style, onInput } = this.props;
    return <div className={`${className} text-input`}>
      {icon && prefixIcon &&
              <div className='input-icon'>
                <i className='material-icons'>{icon}</i>
              </div>
      }
      <div
        onClick={onClick}
        onInput={onInput}
        className={joinClasses('poplet-input', className)}
        contentEditable='true'
        suppressContentEditableWarning={true}
        role='textbox'
        spellCheck='false'
        style={{ outline: 'none', userSelect: 'text', whiteSpace: 'pre-wrap', overflowWrap: 'break-word', ...style }}>{this.props.children || ''}
      </div>
      {icon && !prefixIcon &&
        <div className='input-icon'>
          <i className='material-icons'>{icon}</i>
        </div>}
    </div>;
  }
}

export default Input;

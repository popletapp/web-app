import React, { Component } from 'react';
import './Input.scss';

class Input extends Component {
    constructor ({ icon = 'search', prefixIcon = false, placeholder }) {
      super();
      this.icon = icon;
      this.prefixIcon = prefixIcon;
      this.placeholder = placeholder;
    }

    render () {
        const { icon, prefixIcon, placeholder } = this;
        return <div className='text-input-container'>
            {icon && prefixIcon && 
              <div className='input-icon'>
                <i className='material-icons'>{icon}</i>
              </div>
            }
            <div class='text-input'
             placeholder={placeholder || ''} 
             contenteditable='true' 
             role='textbox' 
             spellcheck='false' 
             style={{ outline: 'none', userSelect: 'text', whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
            </div>
            {icon && !prefixIcon && 
              <div className='input-icon'>
                <i className='material-icons'>{icon}</i>
              </div>
            }
            
          </div>
    }
}

export default Input;
import React, { Component } from 'react';
import './Button.scss';

class RoundedButton extends Component {
    constructor ({ label, color, icon, small }) {
        super();
        this.label = label;
        this.color = color || 'red';
        this.icon = icon || 'add';
        this.small = small || false;
    }

    render() {
        const { small, icon, color, label } = this.props;
        return (
            <div className='btn-floating-container'>
                <div className='floating-btn-button'>
                    <button {...this.props}
                    className={`${small ? 'btn-small' : ''} btn-floating ${color}`}>
                        <i className="material-icons">{icon}</i>
                    </button>
                </div>
                {label && <div className='center floating-btn-label'><label>{label}</label></div>}
            </div>
        );
    };
}

export default RoundedButton;
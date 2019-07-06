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
        const dontInclude = [ 'small', 'icon', 'color', 'label' ];
        return (
            <div className='btn-floating-container'>
                <div className='floating-btn-button'>
                    <button 
                    {...Object.fromEntries(Object.entries(this.props)
                        .filter(item => !dontInclude.includes(item[0]))
                    )
                    }
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
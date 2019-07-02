import React from 'react';
import './Button.scss';

export default ({ label, color = 'red', waves = true, icon = 'add', className, small }) => {
    return (
        <div className='btn-floating-container'>
            <div className='floating-btn-button'>
                <button className={`${small ? 'btn-small' : ''} btn-floating ${waves ? 'waves-effect waves-light' : ''} ${color} ${className || ''}`}>
                    <i className="material-icons">{icon}</i>
                </button>
            </div>
            {label && <div className='center floating-btn-label'><label>{label}</label></div>}
        </div>
    );
}
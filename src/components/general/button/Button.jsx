import React, { Component } from 'react';
import './Button.scss';

class Button extends Component {
    constructor ({ text, color }) {
        super();
        this.text = text;
        this.color = color;
    }

    render() {
        return (
            <button data-target={this.props['data-target']}
            className={`waves-effect waves-light btn-small${this.color ? ` ${this.color}` : ''}${this.props.className ? ` ${this.props.className}` : ''}`}>
                {this.text || this.props.children}
            </button>
        );
    };
}

export default Button;
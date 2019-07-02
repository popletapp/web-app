import React, { Component } from 'react';
import { Modal as ModalRenderer } from '../../../modules';
import './Modal.scss';

class Modal extends Component {
    constructor () {
        super();
        this.state = {};
    }

    actionMade () {
        console.log(this.state)
        new ModalRenderer().obliterate();
    }

    render () {
        return (
            <div className="modal poplet-modal" style={{ display: 'block' }}>
                <div className="modal-content">
                    <h4>{this.props.title}</h4>
                    <p>{this.props.content}</p>
                </div>
                <div className="modal-footer">
                    <button onClick={this.actionMade} className="modal-close waves-effect waves-white btn-flat green">OK</button>
                </div>
            </div>
        );
    }
}

export default Modal;
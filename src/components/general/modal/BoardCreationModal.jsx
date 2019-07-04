import React from 'react';
import Modal from './Modal';
import axios from 'axios';
import Poplet from './../../../';
import './Modal.scss';

class BoardCreationModal extends Modal {
    constructor () {
        super();
        this.state = {
            name: '',
            error: ''
        };
    }

    handleEvent (event, type) {
        if (type === 'confirm') {
            try {
                this.create()
                this.actionMade();
            } catch (err) {
                event.preventDefault();
                this.setState({ error: err.message })
            }
        } else {
            this.actionMade();
            event.preventDefault();
        }
    }

    async create () {
        const { name } = this.state;
        if (!name) {
            throw new Error('You need to enter a name for this board!');
        } else if (name.length < 2) {
            throw new Error('The name of this board needs to be longer than 2 characters')
        }
        const board = await axios.post('/board/create', { name });
        Poplet.boards.selected = board.id;
        Poplet.app.forceUpdate();
    }

    render () {
        return (
            <div className="modal poplet-modal" style={{ display: 'block' }}>
                <div className="modal-content">
                    <h4>Create New Board</h4>
                    <p>Create a new board boy</p>
                    <p className='modal-error'>{this.state.error}</p>
                    <input onChange={(e) => this.setState({ name: e.target.value })} className='materialize-input' placeholder='Board Name'></input>
                </div>
                <div className="modal-footer">
                    <button onClick={(e) => this.handleEvent(e, 'cancel')} className="modal-close waves-effect waves-white btn-flat grey">{this.props.cancelText || 'Cancel'}</button>
                    <button onClick={(e) => this.handleEvent(e, 'confirm')} className="modal-close waves-effect waves-white btn-flat green">{this.props.confirmText || 'OK'}</button>
                </div>
            </div>
        );
    }
}

export default BoardCreationModal;
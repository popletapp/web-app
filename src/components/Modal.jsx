import React from 'react';

export default ({ modal }) => {
    return (
        <div id="modal1" class="modal">
            <div class="modal-content">
                <h4>{modal.title}</h4>
                <p>{modal.content}</p>
            </div>
            <div class="modal-footer">
                <a href="#!" class="modal-close waves-effect waves-green btn-flat">OK</a>
            </div>
        </div>
    );
}
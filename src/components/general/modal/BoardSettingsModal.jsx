import React from 'react';
import Modal from './Modal';
import { connect } from 'react-redux';
import { InviteSettingsScreen, RankSettingsScreen, Flex, FlexChild } from '../../';

import './Modal.scss';
import './BoardSettingsModal.scss';

function mapStateToProps (state) {
  return {
    board: state.boards[state.selectedBoard]
  };
}

class BoardSettingsModal extends Modal {
  constructor ({ boardId }) {
    super();
    this.boardId = boardId;
    this.state = {
      selectedTab: 'GENERAL'
    };
  }

  switchTab (tab) {
    this.setState({
      selectedTab: tab.toUpperCase()
    });
  }

  componentDidMount () {
    const modal = document.querySelector('.board-settings');
    modal.parentElement.style = 'margin: 0; max-width: 100%; max-height: 100%;';
  }

  render () {
    const { board } = this.props;
    const { selectedTab } = this.state;
    return <div className='board-settings'>
      <div className='modal-content'>
        <Flex align='right' className='board-settings-left-panel'>
          <FlexChild align='right' direction='column' className='board-settings-sidebar'>
            <div className='board-settings-header'>
              Settings
            </div>
            <div className='board-settings-header-name'>
              {board.name}
            </div>
            <div className='board-settings-body'>
              <ul className='board-settings-settings-container'>
                <li onClick={() => this.switchTab('general')} className='board-settings-setting'>General</li>
                <li onClick={() => this.switchTab('ranks')} className='board-settings-setting'>Ranks</li>
                <li onClick={() => this.switchTab('invites')} className='board-settings-setting'>Invites</li>
              </ul>
            </div>
          </FlexChild>
        </Flex>

        <div className='board-settings-content'>
          {(() => {
            switch (selectedTab) {
              case 'GENERAL': {
                return <RankSettingsScreen />;
              }
              case 'RANKS': {
                return <RankSettingsScreen />;
              }
              case 'INVITES': {
                return <InviteSettingsScreen />;
              }
              default: {
                return <RankSettingsScreen />;
              }
            }
          })()}
        </div>
      </div>
    </div>;
  }
}

export default connect(mapStateToProps, null)(BoardSettingsModal);

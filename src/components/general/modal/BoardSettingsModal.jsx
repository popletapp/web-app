import React from 'react';
import Modal from './Modal';
import { connect } from 'react-redux';
import { GeneralSettingsScreen, InviteSettingsScreen, CloseButton, RankSettingsScreen, Flex, FlexChild, NoteSettingsScreen, Input } from '../../';

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

  switchTab (tab, e) {
    this.setState({
      selectedTab: tab.toUpperCase()
    });
    const tabs = [ ...document.querySelectorAll('.board-settings-setting-selected') ];
    for (const existingTab of tabs) {
      existingTab.classList.remove('board-settings-setting-selected');
    }
    e.target.classList.add('board-settings-setting-selected');
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
          <FlexChild align='left' grow={0} direction='column'>
            <Flex direction='row' grow={0} align='center' justify='center'>
              <div className='board-settings-header'>
                Settings
              </div>
              <CloseButton onClick={() => this.actionMade()} style={{ marginLeft: '50px' }} size='40px' />
            </Flex>

            <div className='board-settings-header-name'>
              {board.name}
            </div>
            <Input prefixIcon icon='search' placeholder='Search settings' />
            <br />
          </FlexChild>
          <FlexChild align='right' direction='column' className='board-settings-sidebar'>
            <div className='board-settings-body'>
              <ul className='board-settings-settings-container'>
                <li onClick={(e) => this.switchTab('general', e)} className='board-settings-setting'>General</li>
                <li onClick={(e) => this.switchTab('notes', e)} className='board-settings-setting'>Notes</li>
                <li onClick={(e) => this.switchTab('ranks', e)} className='board-settings-setting'>Ranks</li>
                <li onClick={(e) => this.switchTab('invites', e)} className='board-settings-setting'>Invites</li>
              </ul>
            </div>
          </FlexChild>
        </Flex>

        <div className='board-settings-content'>
          {(() => {
            switch (selectedTab) {
              case 'GENERAL': {
                return <GeneralSettingsScreen />;
              }
              case 'NOTES': {
                return <NoteSettingsScreen />;
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

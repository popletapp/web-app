import React from 'react';
import Popout from './Popout';
import { Flex, FlexChild, Avatar, Button, Indicator, ListPopout, CloseButton } from '../../';
import './Popout.scss';
import Poplet from './../../../';
import { updateMember } from './../../../modules';
import { connect } from 'react-redux';
import { permissions } from './../../../util';
import { Messages } from '../../../i18n';

function mapStateToProps (state) {
  return {
    ranks: Object.values(state.ranksByBoard[state.selectedBoard] || {}),
    boardID: state.selectedBoard,
    board: state.boards[state.selectedBoard]
  }
}

class MemberPopout extends Popout {
  async removeRankFromMember (rank) {
    const { member, boardID } = this.props;
    member.ranks = member.ranks.filter(r => r !== rank.id);
    await updateMember(boardID, member);
    this.updateSelf();
  }

  async addRankToMember (rank) {
    const { member, boardID } = this.props;
    member.ranks.push(rank.id);
    await updateMember(boardID, member);
    this.updateSelf();
  }

  onRankListClose () {
    this.updateSelf();
  }

  content () {
    let { member, ranks, boardID, board } = this.props;
    const store = Poplet.store;
    const state = store.getState();
    member = state.membersByBoard[boardID][member.id];

    return (
      <Flex className='member-popout popout'>
        <FlexChild className='popout-content'>
          <Flex direction='row' className='popout-header member-popout-header'>
            <Avatar url={member.avatar} alt={member.username} size='medium' />
            <FlexChild className='member-popout-title'>
              <div className='member-popout-username'>{member.username}</div>
              <Indicator mode='online' text={true} />
            </FlexChild>
          </Flex>

          <Flex direction='row' className='popout-body member-popout-body'>
            <FlexChild className='member-popout-body-item'>
              <div className='member-popout-subheading'>
                {Messages.POPOUT_MEMBER_ACCOUNT_CREATED_HEADER}
              </div>
              {new Date(member.createdAt).toLocaleDateString()}
            </FlexChild>

            <FlexChild className='member-popout-body-item'>
              <div className='member-popout-subheading'>
                {Messages.POPOUT_MEMBER_JOINED_BOARD_HEADER}
              </div>
              {new Date(member.joinedAt).toLocaleDateString()}
            </FlexChild>
          </Flex>

          <Flex>
            <div style={{ marginTop: '18px' }} className='member-popout-subheading'>
              {Messages.RANKS} — {Math.max(0, member.ranks.length - 1) /* -1 here because everyone has the default role */}
            </div>

            <Flex className='rank-popout-container' direction='row' align='center'>
              {member.ranks.map((rank, i) => {
                rank = ranks.find(r => r.id === rank);
                if (!rank) return null;
                return (
                  <Flex key={i} className='rank-small' align='center' direction='row' align='center'>
                    <div className='rank-small-name'>{rank.name}</div>
                    <CloseButton className='rank-small-close' onClick={() => this.removeRankFromMember(rank)} />
                  </Flex>
                )
              })}
              {permissions.has('MANAGE_MEMBERS') && <ListPopout title='Apply Ranks' exclude={board.ranks.filter(l => member.ranks.includes(l.id))} 
                elements={board.ranks} onOptionSelected={(e) => this.addRankToMember(e)}>
              <div className='add-btn'>+</div>
            </ListPopout>}
            </Flex>
          </Flex>
          
          <br />
          <Button>{Messages.POPOUT_MEMBER_VIEW_PROFILE}</Button>
        </FlexChild>

        <Flex className='popout-footer member-popout-footer' direction='row' justify='end' align='right'>
          {Messages.POPOUT_MEMBER_MORE_ACTIONS_SOON}
        </Flex>
      </Flex>
    );
  }
}

export default connect(mapStateToProps, null)(MemberPopout);

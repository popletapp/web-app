import React from 'react';
import Popout from './Popout';
import { Flex, FlexChild, Avatar, Button, Indicator, RankListPopout, CloseButton } from '../../';
import './Popout.scss';
import Poplet from './../../../';
import { updateMember } from './../../../modules';
import { connect } from 'react-redux';
import { permissions } from './../../../util';

function mapStateToProps (state) {
  return {
    ranks: Object.values(state.ranksByBoard[state.selectedBoard] || {}),
    boardID: state.selectedBoard
  }
}

class MemberPopout extends Popout {
  async removeRankFromMember (rank) {
    const { member, boardID } = this.props;
    member.ranks = member.ranks.filter(r => r !== rank.id);
    await updateMember(boardID, member);
    this.updateSelf();
  }

  onRankListClose () {
    this.updateSelf();
  }

  content () {
    let { member, ranks, boardID } = this.props;
    const store = Poplet.store;
    const state = store.getState();
    member = state.membersByBoard[boardID][member.id];

    return (
      <Flex className='popout'>
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
                Created
              </div>
              {new Date(member.createdAt).toLocaleDateString()}
            </FlexChild>

            <FlexChild className='member-popout-body-item'>
              <div className='member-popout-subheading'>
                Joined Board
              </div>
              {new Date(member.joinedAt).toLocaleDateString()}
            </FlexChild>
          </Flex>

          <Flex>
            <div style={{ marginTop: '18px' }} className='member-popout-subheading'>
              Ranks — {member.ranks.length - 1 /* -1 here because everyone has the default role */}
            </div>

            <Flex className='rank-popout-container' direction='row' align='center'>
              {member.ranks.map((rank, i) => {
                rank = ranks.find(r => r.id === rank);
                if (!rank) return null;
                return (
                  <Flex key={i} className='rank-small' direction='row' align='center'>
                    <div className='rank-small-name'>{rank.name}</div>
                    <CloseButton className='rank-small-close' onClick={() => this.removeRankFromMember(rank)} />
                  </Flex>
                )
              })}
              {permissions.has('MANAGE_MEMBERS') && <RankListPopout onClose={() => this.onRankListClose()} member={member}>
                 <div className='rank-add-btn'>+</div>
              </RankListPopout>}
            </Flex>
          </Flex>
          
          <br />
          <Button>View Profile</Button>
        </FlexChild>

        <Flex className='popout-footer member-popout-footer' direction='row' justify='end' align='right'>
          More actions coming soon. Thanks for using Poplet!
        </Flex>
      </Flex>
    );
  }
}

export default connect(mapStateToProps, null)(MemberPopout);

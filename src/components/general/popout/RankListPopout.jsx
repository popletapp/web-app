import React from 'react';
import Popout from './Popout';
import { Flex, FlexChild, Avatar, Button, Indicator, CloseButton } from '../..';
import { updateMember } from './../../../modules';
import './Popout.scss';
import './RankListPopout.scss';
import { connect } from 'react-redux';
import { Messages } from '../../../i18n';

function mapStateToProps (state) {
  return {
    ranks: Object.values(state.ranksByBoard[state.selectedBoard]),
    boardID: state.selectedBoard
  }
}

class RankListPopout extends Popout {
  async addRankToMember (rank) {
    const { member, boardID } = this.props;
    member.ranks.push(rank.id);
    await updateMember(boardID, member);
    this.close();
  }

  content () {
    const { member, ranks } = this.props;
    const memberRanks = ranks.filter(rank => !member.ranks.includes(rank.id));
    return (
      <Flex className='popout'>
        <FlexChild className='popout-content'>
          <div className='rank-list-header'>
            {Messages.POPOUT_RANK_LIST_TITLE.replace('{0}', member.username)}
          </div>

          <Flex className='rank-option-list' direction='column' align='center'>
            {memberRanks.length && memberRanks.map(rank => (
              <Flex className='rank-option' onClick={() => this.addRankToMember(rank)} direction='row' align='center'>
                <div className='rank-option-name'>{rank.name}</div>
              </Flex>
            ))}
            {!memberRanks.length && <div>{Messages.POPOUT_RANK_LIST_NO_RANKS}</div>}
          </Flex>
        </FlexChild>
      </Flex>
    );
  }
}

export default connect(mapStateToProps, null)(RankListPopout);

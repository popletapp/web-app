import React, { Component } from 'react';
import Modal from './Modal';
import { Flex, FlexChild, Button, Scroller, UsernameText, Avatar } from '../..';
import { getActionLog } from '../../../modules';
import './EditRevisionsModal.scss';
import { connect } from 'react-redux';
import { diffText, parseTime } from './../../../util';

function mapStateToProps (state) {
  return {
    users: state.users.items
  }
}

class Revision extends Component {
  render () {
    const { executor, beforeContent, afterContent, timestamp } = this.props;
    const editTime = new Date(timestamp);
    return (<Flex className='edit-revision'>
      <FlexChild className='edit-revision-executor'>
        <Flex direction='row' align='center' className='user-container'>
          <FlexChild>
            <Avatar url={executor.avatar} alt={executor.username} />
          </FlexChild>
          <FlexChild style={{ marginLeft: '12px' }}>
            <UsernameText className='edit-revision-executor-username'>{executor.username}</UsernameText>
            <span className='edit-revision-timestamp'>{parseTime.timeAgo(editTime)}</span>
          </FlexChild>
        </Flex>
      </FlexChild>
      <div className='edit-revision-content'>
        {diffText(beforeContent, afterContent).map((part) => {
          return (<span className={part.added ? 'edit-revision-content-added' : 
          (part.removed ? 'edit-revision-content-removed' : 'edit-revision-content-normal')}>
            {part.value}
          </span>);
        })}
      </div>
    </Flex>)
  }
}

class EditRevisionsModal extends Modal {
  constructor () {
    super();
    this.state = {
      error: null
    };
  }

  async componentDidMount () {
    const { boardID } = this.props;
    this.setState({
      actionLog: await getActionLog(boardID, 'NOTE_UPDATE', 20, 0)
    });
  }

  render () {
    const { users, noteId } = this.props;
    const { actionLog } = this.state;

    return (
      <div>
        <div className='modal-content edit-revision-modal-content'>
          <div className='modal-header'>
            Edit revisions for this note
          </div>
          
          <div className='modal-body'>
            <p className='modal-error'>{this.state.error}</p>
            <Flex className='edit-revision-container'>
              <Scroller style={{ maxHeight: '500px' }}>
                {!actionLog && <div>Loading...</div>}
                {actionLog && actionLog.filter(m => m && m.before && m.before.id === noteId).map((log) => {
                  const user = users[log.executor || { username: 'Unknown User' }];
                  return <Revision executor={user} beforeContent={log.before.content} afterContent={log.after.content} timestamp={log.timestamp} />
                })}
              </Scroller>
            </Flex> 
          </div>
        </div>
        <Flex className='modal-footer edit-revision-modal-footer' direction='row' justify='end' align='right'>
          <Button onClick={(e) => this.actionMade('cancel', e)} className='modal-cancel btn'>Done</Button>
        </Flex>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(EditRevisionsModal);

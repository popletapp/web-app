import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Avatar, Scroller, HorizontalScroller, RoundedButton, Flex, FlexChild, MinimalisticButton } from './../';
import { createChatroom, deleteChatroom, createChatroomComment } from './../../modules';
import TimeParser from './../../util/parseTime';
import './Chatroom.scss';

function mapStateToProps (state, props) {
  return {
    chatroom: state.chatroomsByBoard[state.selectedBoard] ? state.chatroomsByBoard[state.selectedBoard][props.id] : null,
    chatrooms: state.chatroomsByBoard[state.selectedBoard],
    comments: state.commentsByChatroom[props.id],
    user: state.user,
    boardID: state.selectedBoard
  };
}

class Comment extends Component {
  render () {
    const { author, children } = this.props;
    return (
      <Flex className='chatroom-comment-container'>
        <FlexChild direction='row' align='center' justify='center' className='chatroom-comment-author'>
          <Avatar url={author.avatar} alt={author.username} />
          <p className='chatroom-comment-author-username'>{author.username}</p>
        </FlexChild>
        <FlexChild className='chatroom-comment-content'>
          <p>{children}</p>
        </FlexChild>
      </Flex>
    );
  }
}

class Chatroom extends Component {
  constructor ({ id }) {
    super();
    this.id = id;
    this.state = {
      content: ''
    };
  }

  handleChange (event) {
    this.setState({ content: event.target.value });
    event.stopPropagation();
  }

  input (event) {
    if (event.which === 13 && !event.shiftKey) {
      this.createComment();
    }
  }

  async createComment (event) {
    const { id } = this.props;
    this.setState({ content: '' });
    const { user } = this.props;
    const { content } = this.state;
    await createChatroomComment(id, {
      author: user,
      content
    });
  }

  render () {
    let { chatroom, chatrooms, boardID, comments } = this.props;
    const { content } = this.state;
    chatrooms = chatrooms ? Object.values(chatrooms) : null;
    comments = comments ? Object.values(comments) : null;
    if (!chatroom) {
      return null;
    }

    return (
      <Flex className='chatroom-container'>
        <FlexChild className='chatroom-root'>
          <Flex grow={0} className='chatroom-tabs' direction='row'>
            <HorizontalScroller style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
              {chatrooms && chatrooms.map((cr, i) =>
                <FlexChild basis={'150px'} grow={0} key={i} className='chatroom-tab-room' direction='row'>
                  <FlexChild>
                    <div className='chatroom-tab-room-name'>{cr.name}</div>
                  </FlexChild>
                  <FlexChild align='right'>
                    <MinimalisticButton icon='close' className='chatroom-tab-room-btn chatroom-tab-room-btn-close' />
                  </FlexChild>
                </FlexChild>
              )}
              <FlexChild onClick={() => createChatroom(boardID, { name: 'Chatroom' })} grow={0} className='chatroom-tab-room' justify='center' direction='row' style={{ width: '35px' }}>
                <MinimalisticButton icon='add' className='chatroom-tab-room-btn' />
              </FlexChild>
            </HorizontalScroller>
          </Flex>

          <Flex grow={0} className='chatroom-header' direction='row'>
            <FlexChild className='chatroom-header-information'>
              <div className='chatroom-title'>
                {chatroom.name}
              </div>
              <div className='chatroom-last-active-label'>
                {chatroom.lastMessage ? `Last message sent ${TimeParser.timeAgo(chatroom.lastMessage)}` : 'Not active'}
              </div>
            </FlexChild>
            <FlexChild className='chatroom-header-btns' grow={0} align='right' direction='column'>
              <RoundedButton onClick={() => deleteChatroom(boardID, chatroom.id)} icon='close' color='red lighten-1' small={true} />
              <RoundedButton icon='help' color='grey' small={true} />
            </FlexChild>
          </Flex>

          <Flex className='chatroom-body'>
            <Scroller style={{ width: '100%' }}>
              {comments && comments.map(comment => <Comment key={comment.id} author={comment.author}>{comment.content}</Comment>)}
            </Scroller>
          </Flex>

          <div className='chatroom-textarea-container'>
            <form>
              <textarea
                type='text'
                onChange={(e) => this.handleChange(e)}
                onKeyDown={(e) => this.input(e)}
                value={content}
                placeholder='Enter text here...'
                className='chatroom-textarea'></textarea>
            </form>
          </div>
        </FlexChild>
      </Flex>
    );
  }
}

export default connect(mapStateToProps, null)(Chatroom);

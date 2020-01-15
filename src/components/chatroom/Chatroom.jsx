import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Avatar, Scroller, HorizontalScroller, Flex, FlexChild, MinimalisticButton } from './../';
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
      content: '',
      dragging: false
    };
    this.barMouseMove = this.barMouseMove.bind(this);
    this.barMouseUp = this.barMouseUp.bind(this);
    this.mouseMoveListener = document.addEventListener('mousemove', this.barMouseMove);
    this.mouseUpListener = document.addEventListener('mouseup', this.barMouseUp);
    this.touchMoveListener = document.addEventListener('touchmove', this.barMouseMove);
    this.touchUpListener = document.addEventListener('touchup', this.barMouseUp);
  }

  barMouseDown () {
    this.setState({ dragging: true });
  }

  barMouseMove (event) {
    const { dragging } = this.state;
    if (dragging) {
      const percentage = (event.pageX / window.innerWidth) * 100;
      const mainPercentage = 100 - percentage;

      const chatroom = document.getElementsByClassName('chatroom-container')[0];
      const board = document.getElementsByClassName('board')[0];
      if (chatroom && board) {
        board.style.width = `${percentage}%`;
        chatroom.style.width = `${mainPercentage}%`;
      }
    }
  }

  barMouseUp () {
    const { dragging } = this.state;
    if (dragging) {
      this.setState({ dragging: false });
    }
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
        <div className='chatroom-dragbar' onTouchStart={(e) => this.barMouseDown(e)} onMouseDown={(e) => this.barMouseDown(e)}></div>
        <FlexChild className='chatroom-root'>
          <Flex grow={0} className='chatroom-tabs' align='center' direction='row'>
            <HorizontalScroller style={{ width: '100%' }}>
              <Flex direction='row' align='left'>
                {chatrooms && chatrooms.map((cr, i) =>
                  <FlexChild grow={0} key={i} className='chatroom-tab-room' justify='start' align='left' direction='row'>
                    <FlexChild align='left' justify='start'>
                      <div className='chatroom-tab-room-name'>{cr.name}</div>
                    </FlexChild>
                    <FlexChild align='right' justify='end'>
                      <MinimalisticButton icon='close' className='chatroom-tab-room-btn chatroom-tab-room-btn-close' />
                    </FlexChild>
                  </FlexChild>
                )}
                <FlexChild onClick={() => createChatroom(boardID, { name: 'Chatroom' })} grow={0} className='chatroom-tab-room' justify='center' direction='row'>
                  <MinimalisticButton icon='add' className='chatroom-tab-room-btn' />
                </FlexChild>
              </Flex>
            </HorizontalScroller>
          </Flex>

          <Flex grow={0} className='chatroom-header' align='left' direction='column'>
            <FlexChild className='chatroom-header-information'>
              <div className='chatroom-title'>
                {chatroom.name}
              </div>
              <div className='chatroom-last-active-label'>
                {chatroom.lastMessage ? `Last message sent ${TimeParser.timeAgo(chatroom.lastMessage)}` : 'Not active'}
              </div>
            </FlexChild>
            <FlexChild className='chatroom-header-btns' grow={0} align='center' justify='right' direction='column'>
              <MinimalisticButton icon='edit' />
              <MinimalisticButton icon='help' />
              <MinimalisticButton onClick={() => deleteChatroom(boardID, chatroom.id)} icon='close' />
            </FlexChild>
          </Flex>

          <Flex className='chatroom-body'>
            <Scroller style={{ width: '100%' }}>
              {comments && comments.sort((a, b) => b.timestamp - a.timestamp).map((comment, i) => <Comment key={i} author={comment.author}>{comment.content}</Comment>)}
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

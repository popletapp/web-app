import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Avatar, Scroller, HorizontalScroller, Flex, FlexChild, MinimalisticButton, Tooltip, RichTextbox } from './../';
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

class StackedComment extends Component {
  render () {
    const { author, comments } = this.props;
    return (
      <Flex grow={0} className='chatroom-comment-container'>
        <FlexChild direction='row' align='center' justify='center' className='chatroom-comment-author'>
          <Avatar url={author.avatar} alt={author.username} />
          <p className='chatroom-comment-author-username'>{author.username}</p>
        </FlexChild>
        <FlexChild grow={0} className='chatroom-comment-content'>
          {comments.map((comment, i) => <RichTextbox parseMarkdown={true} editing={false} key={i}>{comment.content}</RichTextbox>)}
        </FlexChild>
      </Flex>
    );
  }
}

class Comment extends Component {
  render () {
    const { author, children } = this.props;
    return (
      <Flex grow={0} className='chatroom-comment-container'>
        <FlexChild direction='row' align='center' justify='center' className='chatroom-comment-author'>
          <Avatar url={author.avatar} alt={author.username} />
          <p className='chatroom-comment-author-username'>{author.username}</p>
        </FlexChild>
        <FlexChild grow={0} className='chatroom-comment-content'>
          <RichTextbox parseMarkdown={true} editing={false}>{children}</RichTextbox>
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
    event.stopPropagation();
    this.setState({ content: event.target.value });
  }

  input (event) {
    if (event.which === 13 && !event.shiftKey) {
      event.preventDefault();
      this.createComment();
      event.target.value = '';
    }
  }

  async createComment (event, content = this.state.content) {
    const { id } = this.props;
    const { user } = this.props;

    const chatroomBody = document.querySelector('.chatroom-body');
    const scroller = chatroomBody.firstChild.firstChild;

    this.setState({ content: '' });
    if (!content) {
      return;
    }
    await createChatroomComment(id, {
      author: user,
      content
    });
    scroller.scrollTo(0, scroller.scrollHeight + 1e4)
  }

  componentDidMount () {
    const chatroomBody = document.querySelector('.chatroom-body');
    const scroller = chatroomBody.firstChild.firstChild;
    scroller.scrollTo(0, scroller.scrollHeight + 1e4)
  }

  textareaOptionsClicked (type) {
    if (type === 'emoji') {
      
    } else if (type === 'send') {
      this.createComment();
    } else if (type === 'image') {
      const input = document.createElement('input');
      input.type = 'file';
      input.style = 'display: none';
      input.click();
    } else if (type === 'upvote') {
      this.createComment(null, '👍');
    }
  }

  render () {
    let { chatroom, chatrooms, boardID, comments } = this.props;
    const { content } = this.state;
    chatrooms = chatrooms ? Object.values(chatrooms) : null;
    comments = comments ? Object.values(comments) : [];
    if (!chatroom) {
      return null;
    }
    let lastCommentProcessed = null;
    let shouldStack = false;
    let stacked = [];
    for (const comment of comments) {
      if (!comment.timestamp) {
        comment.timestamp = Date.now();
      }
    }
    const sortedComments = comments ? comments.sort((a, b) => new Date(b.timestamp || Date.now()) - new Date(a.timestamp || Date.now())).reverse() : [];
    console.log(sortedComments)

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
                {sortedComments.length ? `Last active ${TimeParser.timeAgo(sortedComments[0].timestamp)}` : 'Not active'}
              </div>
            </FlexChild>
            <FlexChild className='chatroom-header-btns' grow={0} align='center' justify='right' direction='column'>
              <MinimalisticButton icon='edit' />
              <MinimalisticButton onClick={() => deleteChatroom(boardID, chatroom.id)} icon='close' />
            </FlexChild>
          </Flex>

          <Flex className='chatroom-body' grow={0}>
            <Scroller style={{ width: '100%', maxWidth: '100%' }}>
              {comments && sortedComments.map((comment, i) => {
                lastCommentProcessed = sortedComments[i - 1];
                const doesStack = (comment, previous) => {
                  if (!comment) return false;
                  if (!previous) return false;
                  return (previous && comment.author.id === previous.author.id 
                    && (new Date(comment.timestamp || Date.now()) - new Date(previous.timestamp || Date.now())) < 6e5)
                }
                const willNextCommentStack = sortedComments[i + 1] ? doesStack(sortedComments[i + 1], comment) : false;
                let final = [];

                if (willNextCommentStack) {
                  if (comment === sortedComments[i + 1]) {
                    stacked.push(comment)
                  } else {
                    stacked.push(sortedComments[i + 1]);
                  }
                  return null;
                } else {
                  if (stacked.length) {
                    final.push(<StackedComment key={i + Math.random()} comments={stacked} author={comment.author} />);
                    stacked = [];
                  } else {
                    final.push(<Comment key={i} author={comment.author}>{comment.content}</Comment>);
                  }
                }
                return final;
              })}
            </Scroller>
          </Flex>

          <div className='chatroom-textarea-container'>
            <div className='chatroom-textarea-options'>
              <Tooltip placement='left' content='Not working yet!'><div><MinimalisticButton onClick={() => this.textareaOptionsClicked('emoji')} icon='insert_emoticon' /></div></Tooltip>
              <MinimalisticButton onClick={() => this.textareaOptionsClicked('image')} icon='insert_photo' />
              <MinimalisticButton onClick={() => this.textareaOptionsClicked('upvote')} icon='thumb_up' />
              <MinimalisticButton onClick={() => this.textareaOptionsClicked('send')} icon='send' />
            </div>
            <form>
              <textarea
                type='text'
                onChange={(e) => this.handleChange(e)}
                onKeyDown={(e) => this.input(e)}
                value={content}
                placeholder='Send a message to this chatroom'
                className='chatroom-textarea'></textarea>
            </form>
          </div>
        </FlexChild>
      </Flex>
    );
  }
}

export default connect(mapStateToProps, null)(Chatroom);

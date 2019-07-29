import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Avatar, Scroller, HorizontalScroller, RoundedButton, Flex, FlexChild } from './../';
import { createChatroom, deleteChatroom, createChatroomComment } from './../../modules';
import TimeParser from './../../util/parseTime';
import './Chatroom.scss';

function mapStateToProps (state, props) {
  return {
    chatroom: state.chatroomsByBoard[state.selectedBoard] ? state.chatroomsByBoard[state.selectedBoard][props.id] : null,
    chatrooms: state.chatroomsByBoard[state.selectedBoard],
    commentsByChatroom: state.commentsByChatroom[props.id],
    user: state.user,
    boardID: state.selectedBoard
  };
}

class Comment extends Component {
  constructor ({ author }) {
    super();
    this.author = author;
  }

  render () {
    const comment = this;
    return (
      <div className='chatroom-comment-container'>
        <div style={{ float: 'left' }} className='chatroom-comment-author'>
          <Avatar style={{ float: 'left' }} url={comment.author.avatar} />
          <p className='chatroom-comment-author-username'>{comment.author.username}</p>
        </div>
        <br />
        <div className='chatroom-comment-content'>
          <p>{comment.props.children}</p>
        </div>
      </div>
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

  async createComment (event) {
    event.preventDefault();
    const { user } = this.props;
    const { content } = this.state;
    await createChatroomComment(this.id, {
      author: user,
      content
    });
  }

  render () {
    let { chatroom, chatrooms, boardID, comments } = this.props;
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
                  <div className='chatroom-tab-room-name'>{cr.name}</div>
                  <i className='material-icons'>close</i>
                </FlexChild>
              )}
              <FlexChild onClick={() => createChatroom(boardID, { name: 'Chatroom' })} grow={0} className='chatroom-tab-room' justify='center' direction='row' style={{ width: '35px' }}>
                <i className='material-icons'>add</i>
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
            <FlexChild className='chatroom-header-btns' direction='column'>
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
            <form onSubmit={(e) => this.createComment(e)}>
              <textarea onChange={(e) => this.handleChange(e)} value={this.state.content} placeholder='Enter text here...' className='chatroom-textarea'></textarea>
              <input type="submit" style={{ height: '0px', width: '0px', border: 'none', padding: '0px' }} hidefocus="true" />
            </form>
          </div>
        </FlexChild>
      </Flex>
    );
  }
}

export default connect(mapStateToProps, null)(Chatroom);

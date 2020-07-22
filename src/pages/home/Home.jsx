import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PopletBase, Avatar, Note, NavBar, BetaModal, 
  Scroller, Flex, FlexChild, Button, UsernameText } from './../../components';
import { createModal, getHomeContent, getPendingFriends, acceptFriendRequest, deleteFriend, getUser } from './../../modules';
import HomeContentTypes from './../../constants/HomeContentTypes';
import { parseTime } from './../../util';
import { Link } from 'react-router-dom';
import './Home.scss';
import { withTranslation } from 'react-i18next';

function mapStateToProps (state) {
  return {
    boards: state.boards,
    notes: state.notes,
    user: state.user
  };
}

const ACKNOWLEDGED_FRIEND_IDS = [];

class FriendRequestItem extends Component {
  render () {
    const { friend } = this.props;
    return (
      <Flex align='center' grow={0} className='pending-friend'>
        <FlexChild align='center' className='pending-friend-info'>
          <Avatar className='pending-friend-avatar' id={friend.id} url={friend.avatar} alt={friend.username} size='medium' />
          <UsernameText className='pending-friend-username'>{friend.username}</UsernameText>
        </FlexChild>

        <FlexChild direction='row' className='pending-friend-btns'>
          <Button onClick={() => {
            ACKNOWLEDGED_FRIEND_IDS.push(friend.id);
            acceptFriendRequest(friend.id);
          }} color='green'>Accept</Button>
          <Button onClick={() => {
            ACKNOWLEDGED_FRIEND_IDS.push(friend.id);
            deleteFriend(friend.id);
          }} color='red'>Decline</Button>
        </FlexChild>
      </Flex>
    )
  }
}

class ActivityFeedItem extends Component {
  constructor () {
    super();
    this.state = {};
  }

  getBoardFromNote (id) {
    const { boards } = this.props;
    for (const board of Object.values(boards)) {
      if (board.notes.indexOf(id)) return board;
    }
    return null;
  }

  async componentDidMount () {
    const { item } = this.props;
    if (item.value.user) {
      this.setState({ user: await getUser(item.value.user) })
    }
  }

  render () {
    const { item } = this.props;
    switch (item.type) {
      // Due date upcoming
      case HomeContentTypes.DUE_DATE_UPCOMING: {
        const note = item.value.note;
        const board = this.getBoardFromNote(note.id) || { name: 'unknown board' };
        if (new Date(note.dueDate).valueOf() < Date.now()) return null;
        return (
          <Flex className='activity-feed-item'>
            <FlexChild align='center' className='activity-feed-item-content' direction='row'>
              <i className='material-icons activity-feed-item-icon'>info_outline</i>
              <Flex>
                {board.id 
                 ? <Link to={`/boards/${board.id}`}><header className='activity-feed-item-board-header'>{board.name}</header></Link>
                 : <header className='activity-feed-item-board-header'>{board.name}</header>}
                <span>"<strong>{note.title}</strong>" is due in {parseTime.timeUntil(note.dueDate)}</span>
                <Note
                  key={note.id}
                  boardId={board.id}
                  noteId={note.id}
                  className='activity-feed-item-note'
                  note={note}
                  preview />
              </Flex>
            </FlexChild>
          </Flex>
        )
      }

      case HomeContentTypes.FRIEND_REQUEST_ACCEPTED: {
        const user = this.state.user || item.value.user || { username: 'Unknown User' };
        return (
          <Flex direction='row' align='center' className='activity-feed-item'>
            <FlexChild align='center' className='activity-feed-item-content' direction='row'>
              <i className='material-icons activity-feed-item-icon'>person_add</i>
              <Flex>
                {!user.id 
                 ? <span>{user.username} accepted your friend request</span>
                 : <span><Link to={`/users/${user.id}`}>{user.username}</Link> accepted your friend request</span>}
              </Flex>
            </FlexChild>
            <FlexChild align='right' className='activity-feed-item-timestamp'>
              {parseTime.timeAgo(item.timestamp, true, true, 1)}
            </FlexChild>
          </Flex>
        )
      }

      case HomeContentTypes.FRIENDSHIP_CREATED: {
        const user = this.state.user || item.value.user || { username: 'Unknown User' };
        return (
          <Flex direction='row' align='center' className='activity-feed-item'>
            <FlexChild align='center' className='activity-feed-item-content' direction='row'>
              <i className='material-icons activity-feed-item-icon'>person_add</i>
              <Flex>
                {!user.id 
                 ? <span>You are now friends with {user.username}!</span>
                 : <span>You are now friends with <Link to={`/users/${user.id}`}>{user.username}</Link>!</span>}
              </Flex>
            </FlexChild>
            <FlexChild align='right' className='activity-feed-item-timestamp'>
              {parseTime.timeAgo(item.timestamp, true, true, 1)}
            </FlexChild>
          </Flex>
        )
      }
      
      case HomeContentTypes.ASSIGNED_TO_NOTE: {
        const note = item.value.note;
        const board = this.getBoardFromNote(note.id) || { name: 'unknown board' };
        return (
          <Flex className='activity-feed-item'>
            <FlexChild align='center' className='activity-feed-item-content' direction='row'>
              <i className='material-icons activity-feed-item-icon'>info_outline</i>
              <Flex>
                {board.id 
                 ? <Link to={`/boards/${board.id}`}><header className='activity-feed-item-board-header'>{board.name}</header></Link>
                 : <header className='activity-feed-item-board-header'>{board.name}</header>}
                <span>You were assigned to "<strong>{note.title}</strong>"</span>
                <Note
                  key={note.id}
                  className='activity-feed-item-note'
                  note={note}
                  preview />
              </Flex>
            </FlexChild>
          </Flex>
        )
      }
    }
  }
}
const ConnectedActivityFeedItem = connect(mapStateToProps, null)(ActivityFeedItem);

class Home extends PopletBase {
  constructor(props) {
    super(props);
    this.state = {
      content: []
    }
  }

  async componentDidMount () {
    await this.init();
    const content = await getHomeContent();
    const pendingFriendships = await getPendingFriends();
    this.setState({
      content,
      pendingFriendships
    });
  }

  render () {
    let { boards, notes, t } = this.props;
    let { content, pendingFriendships = [] } = this.state;
    pendingFriendships = pendingFriendships.filter(f => !ACKNOWLEDGED_FRIEND_IDS.includes(f.id));
    notes = notes.items || [];
    return (
      <div className='poplet-root center-on-page home'>
        <NavBar />

        {!localStorage.getItem('hasSeenBetaPopup') && (() => {
          localStorage.setItem('hasSeenBetaPopup', true);
          createModal(<BetaModal />);
        })()}

        <div className='home-container'>
          <div className='board-selector'>
            <h2>{t("HOME_BOARDS_HEADER")}</h2>
            {Object.values(boards).length ? Object.values(boards).map((board, i) => {
              return (
                <Link key={i} className='board-item' to={`/boards/${board.id}`}>
                  <Avatar id={board.id} url={board.avatar} alt={board.name} size={32} />
                  <div className='board-item-name'>
                    {board.name}
                  </div>
                </Link>
              );
            }) : (
              <div className='no-boards-subtext'>
                You aren't in any boards.
                <Flex className='suggested-boards'>
                  <FlexChild></FlexChild>
                </Flex>
              </div>
            )}

            <Flex className='board-add-items' direction='column' align='center' justify='center'>
              <Link className='board-interaction-btn board-item-join' to={{
                pathname: '/boards/join',
                state: { modal: true }
              }}>
                <div className='board-item-name'>
                  <i className='material-icons'>people</i> {t("JOIN_A_BOARD")}
                </div>
              </Link>

              <header>{t("NAVBAR_REGISTER_OR")}</header>

              <Link className='board-interaction-btn board-item-create' to={{
                pathname: '/boards/create',
                state: { modal: true }
              }}>
                <div className='board-item-name'>
                  <i className='material-icons'>add_circle</i> {t("CREATE_NEW_BOARD")}
                </div>
              </Link>
            </Flex>
            
          </div>

          <div className='home-content-container'>
            <div className='home-content-container-background' />
            <Scroller className='activity-feed'>
              <div className='activity-feed-title'>{t("HOME_ACTIVITY_FEED_HEADER")}</div>
              <div className='activity-feed-content'>
                {(() => {
                  if (!content.length && !pendingFriendships.length) {
                    return <div>{t("HOME_ACTIVITY_FEED_NO_ACTIVITY")}</div>;
                  } else {
                    const stuff = [
                      ...content.map((value) => <ConnectedActivityFeedItem item={value} />)
                    ];
                    if (pendingFriendships.length) {
                      for (const friend of pendingFriendships) {
                        stuff.unshift(<FriendRequestItem friend={friend} />)
                      }
                      stuff.unshift(<div className='pending-friend-title'>{t("HOME_PENDING_FRIENDSHIPS_HEADER")}</div>)
                    }
                    return stuff;
                  }
                })()}
              </div>
            </Scroller>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(connect(mapStateToProps, null)(Home));

import React from 'react';
import { connect } from 'react-redux';
import { PopletBase, Avatar, Note } from './../../components';
import { Link } from 'react-router-dom';
import './Home.scss';

function mapStateToProps (state) {
  return {
    boards: state.boards,
    notes: state.notes,
    user: state.user
  };
}

class Home extends PopletBase {
  async componentDidMount () {
    await this.init();
  }

  render () {
    const { boards, user, notes: { items } } = this.props;
    return (
      <div className='poplet-root center-on-page home'>
        <div className='home-header'>
          <img src='./assets/icons/poplet_white_no_bg.svg' width='32' height='32' alt=''></img>
          <h1 className='home-header-text'>
            Home
          </h1>

          <div className='user-container'>
            <Avatar url={user.avatar} alt={user.username} size={32} />
            <div className='user-username'>{user.username}</div>
          </div>
        </div>

        <div className='home-content-container'>
          <div className='board-selector'>
            <h2>Boards</h2>
            {Object.values(boards).map(board => {
              return (
                <Link className='board-item' to={`/boards/${board.id}`}>
                  <Avatar url={board.avatar} alt={board.name} size={32} />
                  <div className='board-item-name'>
                    {board.name}
                  </div>
                </Link>
              );
            })}
            {/* TODO: link to /boards/join */}
            <Link className='board-item' style={{ backgroundColor: '#65a376' }} to='/boards/join'>
              <div className='board-item-name'>
                Join a Board
              </div>
            </Link>
          </div>
          <div className='activity-feed'>
            <div className='activity-feed-title'>Activity Feed</div>
            <div className='activity-feed-subtitle'>Recently Modified</div>
            {(() => {
              if (!items.length) {
                return <div className='activity-feed-content'>Nothing new on your feed.</div>;
              } else {
                return Object.values(items).filter((a, b) => b.modifiedAt - a.modifiedAt).map(note => <Note key={note.id} id={note.id} preview boardId={(boards.find(board => board.notes.includes(note.id)) || {}).id} />);
              }
            })()}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(Home);

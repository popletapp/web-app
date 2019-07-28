import React from 'react';
import { connect } from 'react-redux';
import { PopletBase, Avatar, Note, NavBar, BetaModal } from './../../components';
import { createModal } from './../../modules';
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
    let { boards, notes } = this.props;
    notes = notes.items;
    const activityFeedNotes = notes
      .sort((a, b) => b.modifiedAt - a.modifiedAt)
      .slice(0, 10)
      .map(note =>
        <Note
          key={note.id}
          id={note.id}
          preview
          boardId={
            (Object.values(boards)
              .find(board => board.notes
                .includes(note.id)) || {}).id
          } />);
    return (
      <div className='poplet-root center-on-page home'>
        <NavBar />

        {!localStorage.getItem('hasSeenBetaPopup') && (() => {
          localStorage.setItem('hasSeenBetaPopup', true);
          createModal(<BetaModal />);
        })()}

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

            <Link className='board-item board-item-join' to={{
              pathname: '/boards/join',
              state: { modal: true }
            }}>
              <div className='board-item-name'>
                Join a Board
              </div>
            </Link>

            <Link className='board-item board-item-create' to={{
              pathname: '/boards/create',
              state: { modal: true }
            }}>
              <div className='board-item-name'>
                Create a new Board
              </div>
            </Link>
          </div>
          <div className='activity-feed'>
            <div className='activity-feed-title'>Activity Feed</div>
            <div className='activity-feed-subtitle'>Recently Modified</div>
            <div className='activity-feed-content'>
              {(() => {
                if (!notes.length) {
                  return <div>Nothing new on your feed.</div>;
                } else {
                  return (
                    <>
                      {activityFeedNotes}
                      {notes.length > 10 && <p>... and {notes.slice(0, 10).length} more notes</p>}
                    </>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(Home);

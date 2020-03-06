import React from 'react';
import { connect } from 'react-redux';
import { PopletBase, Avatar, Note, NavBar, BetaModal, Scroller, Flex } from './../../components';
import { createModal } from './../../modules';
import { Link } from 'react-router-dom';
import './Home.scss';
import { Messages } from '../../i18n';

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
    notes = notes.items || [];
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

        <div className='home-container'>
          <div className='board-selector'>
            <h2>{Messages.HOME_BOARDS_HEADER}</h2>
            {Object.values(boards).map((board, i) => {
              return (
                <Link key={i} className='board-item' to={`/boards/${board.id}`}>
                  <Avatar url={board.avatar} alt={board.name} size={32} />
                  <div className='board-item-name'>
                    {board.name}
                  </div>
                </Link>
              );
            })}

            <Flex className='board-add-items' direction='row' align='center' justify='center'>
              <Link className='board-item board-item-join' to={{
                pathname: '/boards/join',
                state: { modal: true }
              }}>
                <div className='board-item-name'>
                {Messages.JOIN_A_BOARD}
                </div>
              </Link>

              <header>{Messages.NAVBAR_REGISTER_OR}</header>

              <Link className='board-item board-item-create' to={{
                pathname: '/boards/create',
                state: { modal: true }
              }}>
                <div className='board-item-name'>
                  {Messages.CREATE_NEW_BOARD}
                </div>
              </Link>
            </Flex>
            
          </div>

          <div className='home-content-container'>
            <Scroller className='recently-viewed'>
              <div className='recently-viewed-title'>{Messages.HOME_RECENTLY_VIEWED_HEADER}</div>
              <div className='recently-viewed-content'>
                {(() => {
                  if (!notes.length) {
                    return <div>{Messages.HOME_RECENTLY_VIEWED_NONE}</div>;
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
            </Scroller>

            <Scroller className='activity-feed'>
              <div className='activity-feed-title'>{Messages.HOME_ACTIVITY_FEED_HEADER}</div>
              <div className='activity-feed-subtitle'>{Messages.HOME_ACTIVITY_FEED_SUBHEADER_RECENTLY_MODIFIED}</div>
              <div className='activity-feed-content'>
                {(() => {
                  if (!notes.length) {
                    return <div>{Messages.HOME_ACTIVITY_FEED_NO_ACTIVITY}</div>;
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
            </Scroller>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(Home);

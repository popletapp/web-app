import React from 'react';
import Poplet from './../../';
import { connect } from 'react-redux';
import { selectBoard } from './../../actions/board';
import { getNotes } from './../../actions/note';
import { switchBoard } from './../../modules';
import { Link } from 'react-router-dom';

import './Board.scss';

import { Board, Chatroom, PopletBase, NavBar } from './../../components';
import { withTranslation } from 'react-i18next';

function mapStateToProps (state) {
  return {
    board: state.boards[state.selectedBoard],
    notes: state.notes
  };
}

function mapDispatchToProps (dispatch) {
  return {
    selectBoard: boardId => dispatch(selectBoard(boardId)),
    getNotes: boardId => dispatch(getNotes(boardId))
  };
}

class BoardComponent extends PopletBase {
  constructor ({ board }) {
    super();
    this.board = board;
    this.state = {
      loaded: false
    };
  }

  async load () {
    const boardID = this.props.match.params.id || Poplet.boards[0].id;
    if (boardID) {
      await switchBoard(boardID);
    } else {
      this.props.history.push('/home');
    }
    this.setState({ loaded: true });
  }

  async componentDidMount () {
    await this.init();
    this.load();
  }

  async componentDidUpdate (oldProps) {
    if (this.props.match.params.id !== oldProps.match.params.id) {
      this.load();
    }
  }

  render () {
    const { board, t } = this.props;

    if (!this.state.loaded) {
      return (
        <div>
          <NavBar />
          <div className='board-loading center-on-page'>
            <h1>{t("BOARD_LOADING")}</h1>
            <br></br>
            <br></br>
            <h3>
              {t("BOARD_LOADING_PROMOTIONAL_CONTENT_LINE_1")}
              <br />
              {t("BOARD_LOADING_PROMOTIONAL_CONTENT_LINE_2")} <Link to='/premium'>Poplet Premium</Link>
            </h3>
          </div>
        </div>
      );
    }

    if (!board) {
      return (
        <div>
          <NavBar />
          <div className='board-invalid'>
            <h1>{t("BOARD_NOT_FOUND")}</h1>
            <h4>{t("BOARD_NOT_FOUND_BODY_LINE_1")}</h4>
            <Link to='/home'>{t("BOARD_NOT_FOUND_GO_HOME")}</Link>
          </div>
        </div>
      );
    }

    return (
      <div className='poplet-root'>
        <Board key={board.id} id={board.id} />
        <Chatroom id={board.chatrooms[0]}/>
      </div>
    );
  }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(BoardComponent));

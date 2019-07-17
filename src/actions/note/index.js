import {
  REQUEST_NOTES,
  RECEIVE_NOTES,
  INITIALIZE_NOTES,
  BEGIN_CREATE_NOTE,
  END_CREATE_NOTE,
  CREATE_NOTE,
  UPDATE_NOTE,
  DELETE_NOTE
} from '../../constants/ActionTypes';
import axios from 'axios';

export const requestNotes = board => ({
  type: REQUEST_NOTES,
  board
});

export const receiveNotes = (board, data) => ({
  type: RECEIVE_NOTES,
  board,
  notes: data,
  receivedAt: Date.now()
});

export const beginCreateNote = () => ({
  type: BEGIN_CREATE_NOTE
});

export const endCreateNote = () => ({
  type: END_CREATE_NOTE
});

export const initializeNotes = (notes) => ({
  type: INITIALIZE_NOTES,
  notes
});

export const fetchNotes = boardId => dispatch => {
  console.log('Fetching notes for ' + boardId);
  dispatch(requestNotes(boardId));
  return axios.get(`/boards/${boardId}/notes`)
    .then(res => dispatch(receiveNotes(boardId, res.data)))
    .catch(() => dispatch(receiveNotes(boardId, [])));
};

function shouldFetchNotes (state, boardId) {
  const notes = state.notesByBoard[boardId];
  if (!notes) {
    return true;
  } else if (notes.isFetching) {
    return false;
  } else {
    return notes.didInvalidate;
  }
}

export function getNotes (boardId) {
  return (dispatch, getState) => {
    if (shouldFetchNotes(getState(), boardId)) {
      return dispatch(fetchNotes(boardId));
    } else {
      return Promise.resolve(getState().notesByBoard[boardId].items);
    }
  };
}

export const createNote = (board, note) => ({
  type: CREATE_NOTE,
  board,
  note
});

export const updateNote = (board, note) => ({
  type: UPDATE_NOTE,
  board,
  note
});

export const deleteNote = (board, note) => ({
  type: DELETE_NOTE,
  board,
  note
});

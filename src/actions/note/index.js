import { 
  REQUEST_NOTES,
  RECEIVE_NOTES,
  INITIALIZE_NOTES, 
  BEGIN_CREATE_NOTE, 
  CREATE_NOTE, 
  UPDATE_NOTE
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

export const initializeNotes = (notes) => ({
  type: INITIALIZE_NOTES,
  notes
});

export const fetchNotes = boardId => dispatch => {
  console.log('Fetching notes for ' + boardId)
  dispatch(requestNotes(boardId))
  return axios.get(`/board/notes/${boardId}`)
    .then(res => dispatch(receiveNotes(boardId, res.data)))
}

function shouldFetchNotes (state, boardId) {
  const notes = state.notesByBoard[boardId]
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
      return dispatch(fetchNotes(boardId))
    } else {
      console.log(getState().notesByBoard[boardId].items)
      return Promise.resolve(getState().notesByBoard[boardId].items)
    }
  }
}

export const createNote = (note) => ({
  type: CREATE_NOTE,
  note
});

export const updateNote = (note) => ({
  type: UPDATE_NOTE,
  note
});
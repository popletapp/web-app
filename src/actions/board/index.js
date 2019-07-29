import {
  REQUEST_BOARDS,
  RECEIVE_BOARDS,
  CREATE_BOARD,
  SELECT_BOARD,
  JOIN_BOARD,
  UPDATE_VIEW,
  BEGIN_SELECTION,
  END_SELECTION,
  REQUEST_GROUPS,
  RECEIVE_GROUPS,
  CREATE_GROUP,
  UPDATE_GROUP,
  DELETE_GROUP,
  RECEIVE_MEMBERS,
  REQUEST_MEMBERS,
  ADD_RANK,
  UPDATE_RANK,
  REMOVE_RANK
} from '../../constants/ActionTypes';
import axios from 'axios';

export const requestBoards = () => ({
  type: REQUEST_BOARDS
});

export const receiveBoards = (boards) => ({
  type: RECEIVE_BOARDS,
  boards
});

export const fetchBoards = userId => dispatch => {
  dispatch(requestBoards());
  return axios.get(`/users/${userId || 'me'}/boards`)
    .then(res => dispatch(receiveBoards(res.data)))
    .catch(() => dispatch(receiveBoards([])));
};

function shouldFetchBoards () {
  return true;
}

export function getBoards (userId) {
  return (dispatch, getState) => {
    if (shouldFetchBoards(getState())) {
      return dispatch(fetchBoards(userId));
    } else {
      return Promise.resolve(getState().boards);
    }
  };
}

export const createBoard = (board) => ({
  type: CREATE_BOARD,
  board
});

export const selectBoard = (boardId) => ({
  type: SELECT_BOARD,
  board: boardId
});

export const joinBoard = (boardId) => ({
  type: JOIN_BOARD,
  board: boardId
});

export const updateView = (boardId, view) => ({
  type: UPDATE_VIEW,
  board: boardId,
  view
});

export const requestGroups = board => ({
  type: REQUEST_GROUPS,
  board
});

export const receiveGroups = (board, groups) => ({
  type: RECEIVE_GROUPS,
  board,
  groups,
  receivedAt: Date.now()
});

export const fetchGroups = boardId => dispatch => {
  dispatch(requestGroups(boardId));
  return axios.get(`/boards/${boardId}/groups`)
    .then(res => dispatch(receiveGroups(boardId, res.data)))
    .catch(() => dispatch(receiveGroups(boardId, [])));
};

function shouldFetchGroups (state, boardId) {
  const groups = state.groupsByBoard[boardId];
  if (!groups) {
    return true;
  } else if (groups.isFetching) {
    return false;
  } else {
    return true;
  }
}

export function getGroups (boardId) {
  return (dispatch, getState) => {
    if (shouldFetchGroups(getState(), boardId)) {
      return dispatch(fetchGroups(boardId));
    } else {
      return Promise.resolve(getState().groupsByBoard[boardId].items);
    }
  };
}

export const createGroup = (boardId, group) => ({
  type: CREATE_GROUP,
  board: boardId,
  group
});

export const updateGroup = (boardId, group) => ({
  type: UPDATE_GROUP,
  board: boardId,
  group
});

export const deleteGroup = (boardId, groupId) => ({
  type: DELETE_GROUP,
  board: boardId,
  groupId
});

export const beginSelection = (obj) => ({
  type: BEGIN_SELECTION,
  selection: obj // object containing x1, x2, y1, y2
});

export const endSelection = (obj) => ({
  type: END_SELECTION,
  selection: obj
});

export const requestMembers = board => ({
  type: REQUEST_MEMBERS,
  board
});

export const receiveMembers = (board, data) => ({
  type: RECEIVE_MEMBERS,
  board,
  members: data,
  receivedAt: Date.now()
});

export const fetchMembers = boardId => dispatch => {
  dispatch(requestMembers(boardId));
  return axios.get(`/boards/${boardId}/members`)
    .then(res => dispatch(receiveMembers(boardId, res.data)))
    .catch(() => dispatch(receiveMembers(boardId, [])));
};

function shouldFetchMembers (state, boardId) {
  const notes = state.membersByBoard[boardId];
  if (!notes) {
    return true;
  } else if (notes.isFetching) {
    return false;
  } else {
    return notes.didInvalidate;
  }
}

export function getMembers (boardId) {
  return (dispatch, getState) => {
    if (shouldFetchMembers(getState(), boardId)) {
      return dispatch(fetchMembers(boardId));
    } else {
      return Promise.resolve(getState().membersByBoard[boardId]);
    }
  };
}

export const addRank = (boardID, rank) => ({
  type: ADD_RANK,
  boardID,
  rank
});

export const removeRank = (boardID, rankID) => ({
  type: REMOVE_RANK,
  boardID,
  rankID
});

export const updateRank = (boardID, rank) => ({
  type: UPDATE_RANK,
  boardID,
  rank
});

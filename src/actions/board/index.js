import {
  REQUEST_BOARDS,
  RECEIVE_BOARDS,
  CREATE_BOARD,
  SELECT_BOARD,
  UPDATE_BOARD,
  DELETE_BOARD,
  JOIN_BOARD,
  LEAVE_BOARD,
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
  REMOVE_RANK,
  ADD_MEMBER,
  REMOVE_MEMBER,
  UPDATE_MEMBER,
  ADD_LABEL,
  UPDATE_LABEL,
  REMOVE_LABEL
} from '../../constants/ActionTypes';
import axios from 'axios';

export const requestBoards = () => ({
  type: REQUEST_BOARDS
});

export const receiveBoards = (boards) => ({
  type: RECEIVE_BOARDS,
  boards
});

export const fetchBoards = userId => async dispatch => {
  dispatch(requestBoards());
  try {
    const res = await axios.get(`/users/${userId || 'me'}/boards`);
    return dispatch(receiveBoards(res.data));
  } catch (e) {
    return dispatch(receiveBoards([]));
  }
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

export const updateBoard = (boardId, board) => ({
  type: UPDATE_BOARD,
  boardId,
  board
});

export const selectBoard = (boardId) => ({
  type: SELECT_BOARD,
  board: boardId
});

export const joinBoard = (board) => ({
  type: JOIN_BOARD,
  board
});

export const leaveBoard = (boardId) => ({
  type: LEAVE_BOARD,
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

export const fetchGroups = boardId => async dispatch => {
  dispatch(requestGroups(boardId));
  try {
    const res = await axios.get(`/boards/${boardId}/groups`);
    return dispatch(receiveGroups(boardId, res.data));
  } catch (e) {
    return dispatch(receiveGroups(boardId, []));
  }
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

export const fetchMembers = boardId => async dispatch => {
  dispatch(requestMembers(boardId));
  try {
    const res = await axios.get(`/boards/${boardId}/members`);
    return dispatch(receiveMembers(boardId, res.data));
  } catch (e) {
    return dispatch(receiveMembers(boardId, []));
  }
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

export const addLabel = (boardID, label) => ({
  type: ADD_LABEL,
  boardID,
  label
});

export const removeLabel = (boardID, labelID) => ({
  type: REMOVE_LABEL,
  boardID,
  labelID
});

export const updateLabel = (boardID, label) => ({
  type: UPDATE_LABEL,
  boardID,
  label
});

export const addMember = (boardID, member) => ({
  type: ADD_MEMBER,
  board: boardID,
  member
});

export const removeMember = (boardID, memberId) => ({
  type: REMOVE_MEMBER,
  board: boardID,
  memberId
});

export const updateMember = (boardID, member) => ({
  type: UPDATE_MEMBER,
  boardID,
  member
});

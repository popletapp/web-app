import {
  CREATE_BOARD,
  SELECT_BOARD,
  JOIN_BOARD,
  POPULATE_BOARDS,
  UPDATE_VIEW,
  BEGIN_SELECTION,
  END_SELECTION,
  RECEIVE_GROUPS,
  CREATE_GROUP,
  UPDATE_GROUP,
  DELETE_GROUP
} from '../../constants/ActionTypes';

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

export const populateBoards = (array) => ({
  type: POPULATE_BOARDS,
  boards: array
});

export const receiveGroups = (groups) => ({
  type: RECEIVE_GROUPS,
  groups
});

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

export const deleteGroup = (boardId, group) => ({
  type: DELETE_GROUP,
  board: boardId,
  group
});

export const beginSelection = (obj) => ({
  type: BEGIN_SELECTION,
  selection: obj // object containing x1, x2, y1, y2
});

export const endSelection = (obj) => ({
  type: END_SELECTION,
  selection: obj
});

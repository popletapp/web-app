import { CREATE_BOARD, SELECT_BOARD, POPULATE_BOARDS } from '../../constants/ActionTypes';

export const createBoard = (board) => ({
  type: CREATE_BOARD,
  board
});

export const selectBoard = (boardId) => ({
  type: SELECT_BOARD,
  board: boardId
});

export const populateBoards = (array) => ({
  type: POPULATE_BOARDS,
  boards: array
});
import { CREATE_BOARD, SWITCH_BOARD } from '../../constants/ActionTypes';

export const createBoard = (board) => ({
  type: CREATE_BOARD,
  board
});

export const switchBoard = (board) => ({
  type: SWITCH_BOARD,
  board
});
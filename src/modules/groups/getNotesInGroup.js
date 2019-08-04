import Poplet from '../..';

export default (items, boardId) => {
  const state = Poplet.store.getState();
  if (!boardId) {
    boardId = state.selectedBoard;
  }
  return items.map(note => state.notesByBoard[boardId][note]);
};

import Poplet from '../..';

export default (noteId) => {
  const store = Poplet.store;
  const state = store.getState();
  for (const group of Object.values(state.groupsByBoard[state.selectedBoard])) {
    if (group.items.includes(noteId)) {
      return group.id;
    }
  }
  return false;
};

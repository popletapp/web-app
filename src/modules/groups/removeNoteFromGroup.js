import Poplet from '../..';
import updateGroup from './updateGroup';

export default async (boardId, groupId, noteId) => {
  const store = Poplet.store;
  const state = store.getState();
  const group = state.groups[groupId];

  if (group) {
    group.items = group.items.filter(note => note !== noteId);
    await updateGroup(boardId, group);
  }
};

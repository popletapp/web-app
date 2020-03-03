import Poplet from '../..';
import { updateGroup, determineSize } from './../';

export default async (boardId, groupId, noteId) => {
  const store = Poplet.store;
  const state = store.getState();
  const group = state.groupsByBoard[boardId][groupId];

  if (group) {
    group.size = determineSize(group);
    group.items = group.items.filter(note => note !== noteId);
    await updateGroup(boardId, group);
    return true;
  } else {
    return false;
  }
};

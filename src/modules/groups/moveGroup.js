import updateGroup from './updateGroup';
import Poplet from '../../';

export default async (boardId, groupId, position) => {
  const store = Poplet.store;
  const state = store.getState();
  const group = state.groupsByBoard[boardId][groupId];

  if (!position) {
    throw new Error('\'moveGroup\' requires \'position\' argument to be a valid object with keys (x,y)');
  }
  const { x, y } = position;
  group.options = group.options || {};
  if (!Number.isInteger(x) || !Number.isInteger(y)) {
    throw new Error('One or more position values are not valid integers');
  }
  group.options.position = { x, y };
  await updateGroup(boardId, group);
  return group;
};

import updateGroup from './updateGroup';
import Poplet from '../../';
import { permissions } from './../../util';

export default (boardId, groupId, position) => {
  if (!permissions.has('MOVE_NOTES')) return false;

  const store = Poplet.store;
  const state = store.getState();
  const group = state.groupsByBoard[boardId][groupId];

  if (!position) {
    throw new Error('\'moveGroup\' requires \'position\' argument to be a valid object with keys (x,y)');
  }
  let { x, y } = position;
  x = Number(x);
  y = Number(y);
  group.position = group.position || {};
  if (!Number.isInteger(x) || !Number.isInteger(y)) {
    throw new Error('One or more position values are not valid integers');
  }
  group.position = { x, y };
  updateGroup(boardId, group);
  return group;
};

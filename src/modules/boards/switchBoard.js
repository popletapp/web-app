import Poplet from '../..';
import { selectBoard, getMembers, getGroups, getChatrooms } from '../../actions/board';
import { getNotes } from '../../actions/note';
import getBoard from './getBoard.js';

export default async (id) => {
  const store = Poplet.store;
  const board = await getBoard(id);
  if (board) {
    store.dispatch(selectBoard(id));
    const groups = await store.dispatch(getGroups(id)).then(g => g.groups);
    const notes = await store.dispatch(getNotes(id));
    const members = await store.dispatch(getMembers(id)).then(g => g.members);
    const chatrooms = await store.dispatch(getChatrooms(id)).then(g => g.chatrooms);
    console.log(`Switching to ${board.id} (${board.name})`, { board, notes, groups, members, chatrooms });
    return { board, notes, groups, members, chatrooms };
  } else {
    return Promise.reject(new Error('Board ID is invalid'));
  }
};

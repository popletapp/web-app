import Poplet from '../..';
import { selectBoard, getMembers, getGroups } from '../../actions/board';
import { getChatrooms, getChatroomComments } from '../../actions/chatroom';
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
    const selectedChatroomComments = chatrooms[0] ? await store.dispatch(getChatroomComments(chatrooms[0].id)).then(g => g.comments) : null;
    console.log(`Switching to ${board.id} (${board.name})`, { board, notes, groups, members, chatrooms, selectedChatroomComments });
    return { board, notes, groups, members, chatrooms, selectedChatroomComments };
  } else {
    return Promise.reject(new Error('Board ID is invalid'));
  }
};

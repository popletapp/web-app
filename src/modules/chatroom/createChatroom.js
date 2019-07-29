import Poplet from '../..';
import { createChatroom } from '../../actions/chatroom';
import axios from 'axios';

export default async (boardId, chatroom) => {
  const store = Poplet.store;
  const value = await axios.put(`/chatrooms`, { ...chatroom, boardID: boardId }).then(res => res.data);
  store.dispatch(createChatroom(boardId, value));
  return value;
};

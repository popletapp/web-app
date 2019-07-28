import Poplet from '../..';
import { createChatroom } from '../../actions/board';
import axios from 'axios';

export default async (boardId, id, chatroom) => {
  const store = Poplet.store;
  const value = await axios.patch(`/chatrooms/${id}`, { ...chatroom, boardID: boardId }).then(res => res.data);
  store.dispatch(createChatroom(boardId, value));
  return value;
};

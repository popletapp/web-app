import Poplet from '../..';
import { updateChatroom } from '../../actions/chatroom';
import axios from 'axios';

export default async (boardId, id, chatroom) => {
  const store = Poplet.store;
  const value = await axios.patch(`/chatrooms/${id}`, { ...chatroom, boardID: boardId }).then(res => res.data);
  store.dispatch(updateChatroom(boardId, value));
  return value;
};

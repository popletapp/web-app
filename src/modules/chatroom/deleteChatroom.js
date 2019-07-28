import Poplet from '../..';
import { deleteChatroom } from '../../actions/board';
import axios from 'axios';

export default async (boardId, id) => {
  const store = Poplet.store;
  const value = await axios.delete(`/chatrooms/${id}`);
  store.dispatch(deleteChatroom(boardId, id));
  return value;
};

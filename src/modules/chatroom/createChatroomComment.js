import Poplet from '../..';
import { createChatroomComment } from '../../actions/chatroom';
import axios from 'axios';

export default async (chatroomID, comment) => {
  const store = Poplet.store;
  const value = await axios.put(`/chatrooms/${chatroomID}/comments`, comment).then(res => res.data);
  store.dispatch(createChatroomComment(chatroomID, value));
  return value;
};

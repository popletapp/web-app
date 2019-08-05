import Poplet from '../..';
import { createLocalChatroomComment, createChatroomComment } from '../../actions/chatroom';
import axios from 'axios';

export default async (chatroomID, comment) => {
  const store = Poplet.store;
  store.dispatch(createLocalChatroomComment(chatroomID, comment));
  const value = await axios.put(`/chatrooms/${chatroomID}/comments`, comment).then(res => res.data);
  Poplet.ws.emit('message', { ...createChatroomComment(chatroomID, value), board: store.getState().selectedBoard });
  return value;
};

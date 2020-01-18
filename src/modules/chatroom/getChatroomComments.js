import Poplet from '../..';
import { getChatroomComments } from '../../actions/chatroom';
import axios from 'axios';

export default async (chatroomID) => {
  const store = Poplet.store;
  const comments = getChatroomComments(chatroomID);
  store.dispatch(comments);
  const value = await axios.get(`/chatrooms/${chatroomID}/comments`).then(res => res.data);
  Poplet.ws.emit('message', { ...comments, board: store.getState().selectedBoard });
  return value;
};

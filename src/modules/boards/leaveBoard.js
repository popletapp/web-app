import Poplet from '../..';
import { removeMember, leaveBoard } from '../../actions/board';
import axios from 'axios';

export default async (board, userID) => {
  const store = Poplet.store;
  if (!userID) {
    userID = store.getState().user.id;
  }
  Poplet.ws.emit('message', removeMember(board, userID));
  await axios.delete(`/boards/${board}/members/${userID}`).then(res => res.data);
  await store.dispatch(leaveBoard(board));
  return board;
};

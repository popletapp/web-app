import Poplet from '../..';
import { updateBoard } from '../../actions/board';
import axios from 'axios';

export default async (boardID, board) => {
  const store = Poplet.store;
  const value = await axios.patch(`/boards/${boardID}`, board).then(res => res.data);
  store.dispatch(updateBoard(boardID, value || board));
  return value;
};

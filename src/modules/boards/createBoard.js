import Poplet from '../..';
import { createBoard } from '../../actions/board';
import axios from 'axios';

export default async (obj) => {
  const store = Poplet.store;
  if (obj && obj.name) {
    const board = await axios.post('/boards', obj).then(res => res.data);
    if (board) {
      await store.dispatch(createBoard(board));
      return board;
    } else {
      return null;
    }
  } else {
    return Promise.resolve('Invalid object provided for BOARD_CREATE');
  }
}

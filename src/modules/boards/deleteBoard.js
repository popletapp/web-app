import Poplet from '../..';
import { deleteBoard } from '../../actions/board';
import axios from 'axios';

export default async (boardID) => {
  const store = Poplet.store;
  store.dispatch(deleteBoard(boardID));
  const value = await axios.delete(`/boards/${boardID}`).then(res => res.data);
  return value;
};

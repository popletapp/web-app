import Poplet from '../..';
import { addRank } from '../../actions/board';
import axios from 'axios';

export default async (boardID, rank) => {
  const store = Poplet.store;
  const value = await axios.put(`/boards/${boardID}/ranks`, rank).then(res => res.data);
  store.dispatch(addRank(boardID, value || rank));
  return value;
};

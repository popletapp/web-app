import Poplet from '../..';
import { removeRank } from '../../actions/board';
import axios from 'axios';

export default async (boardID, rank) => {
  const { id } = rank;
  const store = Poplet.store;
  const value = await axios.delete(`/boards/${boardID}/ranks/${id}`, rank).then(res => res.data);
  store.dispatch(removeRank(boardID, id));
  return value;
};

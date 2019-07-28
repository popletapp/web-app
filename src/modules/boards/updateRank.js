import Poplet from '../..';
import { updateRank } from '../../actions/board';
import axios from 'axios';

export default async (boardID, rank) => {
  const { id } = rank;
  const store = Poplet.store;
  const value = await axios.patch(`/boards/${boardID}/ranks/${id}`, rank).then(res => res.data);
  store.dispatch(updateRank(boardID, value || rank));
  return value;
};

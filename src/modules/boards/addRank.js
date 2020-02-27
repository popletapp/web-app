import Poplet from '../..';
import { addRank } from '../../actions/board';
import axios from 'axios';
import { permissions } from './../../util';


export default async (boardID, rank) => {
  if (!permissions.has('MANAGE_BOARD')) return false;
  const store = Poplet.store;
  const value = await axios.put(`/boards/${boardID}/ranks`, rank).then(res => res.data);
  store.dispatch(addRank(boardID, value || rank));
  return value;
};

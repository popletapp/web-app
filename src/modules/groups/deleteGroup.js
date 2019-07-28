import Poplet from '../..';
import { deleteGroup } from '../../actions/board';
import axios from 'axios';

export default async (boardID, note) => {
  const { id } = note;
  const store = Poplet.store;
  await axios.delete(`/boards/${boardID}/groups/${id}`);
  await store.dispatch(deleteGroup(boardID, note));
  return note;
};

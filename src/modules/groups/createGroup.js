import axios from 'axios';
import Poplet from '../..';
import { createGroup } from './../../actions/board';

export default async (boardID, obj) => {
  const store = Poplet.store;
  const value = await axios.put(`/boards/${boardID}/groups`, { ...obj, boardID }).then(res => res.data);
  await store.dispatch(createGroup(boardID, value));
  return value;
};

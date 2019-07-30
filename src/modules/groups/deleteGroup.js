import Poplet from '../..';
import { deleteGroup } from '../../actions/board';
import axios from 'axios';

export default async (boardID, groupID) => {
  const store = Poplet.store;
  store.dispatch(deleteGroup(boardID, groupID));
  await axios.delete(`/boards/${boardID}/groups/${groupID}`);
  return true;
};

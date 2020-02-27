import Poplet from '../..';
import { updateMember } from '../../actions/board';
import axios from 'axios';
import { permissions } from '../../util';

export default async (boardID, member) => {
  if (!permissions.has('MANAGE_MEMBERS')) return false;
  const { id } = member;
  const store = Poplet.store;
  const value = await axios.patch(`/boards/${boardID}/members/${id}`, member).then(res => res.data);
  store.dispatch(updateMember(boardID, value || member));
  return value;
};

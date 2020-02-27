import Poplet from '../..';
import { updateNote } from '../../actions/note';
import axios from 'axios';
import { permissions } from './../../util';

export default async (boardID, note) => {
  if (!permissions.has('MANAGE_NOTES')) return false;

  const { id } = note;
  const store = Poplet.store;
  store.dispatch(updateNote(boardID, note));
  Poplet.ws.emit('message', updateNote(boardID, note));
  const value = await axios.patch(`/boards/${boardID}/notes/${id}`, note).then(res => res.data);
  return value;
};

import Poplet from '../..';
import { deleteNote } from '../../actions/note';
import axios from 'axios';
import { permissions } from './../../util';

export default async (boardID, noteId) => {
  if (!permissions.has('MANAGE_NOTES')) return false;
  const store = Poplet.store;
  await store.dispatch(deleteNote(boardID, noteId));
  Poplet.ws.emit('message', deleteNote(boardID, noteId));
  await axios.delete(`/boards/${boardID}/notes/${noteId}`);
};

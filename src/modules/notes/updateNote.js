import Poplet from '../..';
import { updateNote } from '../../actions/note';
import { permissions } from './../../util';

export default async (boardID, note) => {
  // Handle validation server-side
  if (!permissions.has('MANAGE_NOTES')) return false;
  Poplet.ws.emit('message', updateNote(boardID, note));
};

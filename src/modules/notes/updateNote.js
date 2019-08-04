import Poplet from '../..';
import { updateNote } from '../../actions/note';

export default async (boardID, note) => {
  // Handle validation server-side
  Poplet.ws.emit('message', updateNote(boardID, note));
};

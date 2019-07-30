import Poplet from '../..';
import { updateNote } from '../../actions/note';
import axios from 'axios';

export default async (boardID, note) => {
  const { id } = note;
  const store = Poplet.store;
  Poplet.ws.emit('message', { type: 'UPDATE_NOTE', board: boardID, note });
  store.dispatch(updateNote(boardID, note));
  const value = await axios.patch(`/boards/${boardID}/notes/${id}`, note).then(res => res.data);
  return value;
};

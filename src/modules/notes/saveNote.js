import Poplet from '../..';
import { updateNote } from '../../actions/note';
import axios from 'axios';

export default async (boardID, note) => {
  const { id } = note;
  const store = Poplet.store;
  store.dispatch(updateNote(boardID, note));
  Poplet.ws.emit('message', updateNote(boardID, note));
  const value = await axios.patch(`/boards/${boardID}/notes/${id}`, note).then(res => res.data);
  return value;
};

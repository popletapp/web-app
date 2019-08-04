import Poplet from '../..';
import { createNote } from '../../actions/note';
import axios from 'axios';

export default async (boardID, note) => {
  const store = Poplet.store;
  store.dispatch(createNote(boardID, note));
  const value = await axios.put(`/boards/${boardID}/notes`, { ...note, boardID }).then(res => res.data);
  Poplet.ws.emit('message', createNote(boardID, value));
  return value;
};

import Poplet from '../..';
import { createNote } from '../../actions/note';
import axios from 'axios';

export default async (boardID, note) => {
  const store = Poplet.store;
  const value = await axios.put(`/boards/${boardID}/notes`, { ...note, boardID }).then(res => res.data);
  store.dispatch(createNote(boardID, value));
  Poplet.ws.emit('message', createNote(boardID, value));
  return value;
};

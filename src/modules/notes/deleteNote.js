import Poplet from '../..';
import { deleteNote } from '../../actions/note';
import axios from 'axios';

export default async (boardID, note) => {
  const { id } = note;
  const store = Poplet.store;
  await axios.delete(`/boards/${boardID}/notes/${id}`);
  await store.dispatch(deleteNote(boardID, note));
  return note;
};

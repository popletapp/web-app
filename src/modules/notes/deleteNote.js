import Poplet from '../..';
import { deleteNote } from '../../actions/note';
import axios from 'axios';

export default async (boardID, noteId) => {
  const store = Poplet.store;
  await axios.delete(`/boards/${boardID}/notes/${noteId}`);
  await store.dispatch(deleteNote(boardID, noteId));
};

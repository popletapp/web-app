import Poplet from '../..';
import { updateNote } from '../../actions/note';
import axios from 'axios';
import { permissions } from './../../util';

export default async (boardID, note, comment) => {
  // if (!permissions.has('CREATE_NOTE_COMMENT')) return false;

  const { id } = note;
  const value = await axios.post(`/boards/${boardID}/notes/${id}/comments`, { note: note.id, ...comment }).then(res => res.data);
  console.log(value)
  return value;
};

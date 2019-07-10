import Poplet from '../..';
import { updateNote } from '../../actions/note';
import axios from 'axios';

export default async (note) => {
  const { id } = note;
  const store = Poplet.store;
  await axios.post(`/notes/update/${id}`, note);
  await store.dispatch(updateNote(id));
  return note;
}

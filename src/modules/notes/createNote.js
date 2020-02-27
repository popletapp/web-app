import Poplet from '../..';
import { createNote } from '../../actions/note';
import { findNextAvailablePosition } from '../';
import axios from 'axios';
import { permissions } from './../../util';

export default async (boardID, note) => {
  const store = Poplet.store;
  if (!permissions.has('MANAGE_NOTES')) return false;
  const value = await axios.put(`/boards/${boardID}/notes`, { ...note, boardID }).then(res => res.data);
  const { position, id } = findNextAvailablePosition(boardID, value, true);
  store.dispatch(createNote(boardID, value));
  Poplet.ws.emit('message', createNote(boardID, value));

  const noteDOM = document.querySelector(`.note[data-id="${id}"]`);
  if (noteDOM) {
    noteDOM.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    noteDOM.classList.add('note-creation-flash')
    setTimeout(() => {
      noteDOM.classList.remove('note-creation-flash')
    }, 3e3);
  }
  return value;
};

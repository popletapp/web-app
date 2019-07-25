import Poplet from '../..';
import getGroups from './../groups/getGroups';
import { selectBoard } from '../../actions/board';
import { getNotes, receiveNotes } from '../../actions/note';
import getBoard from './getBoard.js';

export default async (id) => {
  const store = Poplet.store;
  const board = await getBoard(id);
  if (board) {
    store.dispatch(selectBoard(id));
    const groups = await getGroups(id);
    let notes = await store.dispatch(getNotes(id));
    if (notes.notes) {
      notes = notes.notes;
    } else {
      await store.dispatch(receiveNotes(id, notes));
    }
    console.log(`Switching to ${board.id} (${board.name})`, board, notes);
    return { board, notes, groups };
  } else {
    return Promise.reject(new Error('Board ID is invalid'));
  }
};

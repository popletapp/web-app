import { createNote, saveNote, updateGroup, isNoteInGroup, determineSize, isNoteOverlapping } from './../';
import { endCreateNote } from './../../actions/note';
import Poplet from '../../';

export default async (boardId, noteId, position) => {
  const store = Poplet.store;
  const state = store.getState();
  const notes = state.notesByBoard[boardId];
  const note = noteId ? notes[noteId] : notes['-1'];

  if (!note) {
    throw new Error('Attempt to move invalid note');
  }

  if (!position) {
    throw new Error('\'moveNote\' requires \'position\' argument to be a valid object with keys (x,y)');
  }

  let { x, y } = position;
  x = Number(x);
  y = Number(y);
  if (!Number.isInteger(x) || !Number.isInteger(y)) {
    throw new Error('One or more position values are not valid integers');
  }

  const oldNote = { ...note };
  note.position = { x, y };
  const overlapping = isNoteOverlapping(note, oldNote);

  if (overlapping) {
    note.position = overlapping;
  }

  const groupId = isNoteInGroup(note.id);
  if (groupId) {
    const group = state.groupsByBoard[boardId][groupId];
    group.size = determineSize(group);
    updateGroup(boardId, group);
  }

  if (note.id) {
    saveNote(boardId, note);
    return note;
  } else {
    store.dispatch(endCreateNote(boardId));
    createNote(boardId, note);
  }
};

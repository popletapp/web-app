import { createNote, saveNote, updateGroup, isNoteInGroup, determineSize, isNoteOverlapping, findNextAvailablePosition } from './../';
import Poplet from '../../';

export default async (boardId, noteId, position) => {
  const store = Poplet.store;
  const state = store.getState();
  const notes = state.notesByBoard[boardId];
  const note = notes[noteId];

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

  note.position = { x, y };

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
    createNote(boardId, note);
  }
};

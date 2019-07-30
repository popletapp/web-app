import Poplet from '../../';
import updateGroup from './updateGroup';
import saveNote from './../notes/saveNote';

export default async (boardId, groupId, noteId) => {
  const store = Poplet.store;
  const state = store.getState();
  const group = state.groupsByBoard[boardId][groupId];
  if (group && !group.items.includes(noteId)) {
    const note = state.notesByBoard[boardId][noteId];
    note.options.position = { x: 0, y: 0 };
    group.items.push(noteId);
    await updateGroup(boardId, group);
    await saveNote(boardId, note);
  }
};

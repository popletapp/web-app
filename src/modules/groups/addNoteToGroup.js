import Poplet from '../../';
import { updateGroup, saveNote, determineSize } from './../';
import { permissions } from './../../util';

export default (boardId, groupId, noteId) => {
  if (!permissions.has('MANAGE_NOTES')) return false;
  const store = Poplet.store;
  const state = store.getState();
  const group = state.groupsByBoard[boardId][groupId];
  if (group && !group.items.includes(noteId)) {
    const note = state.notesByBoard[boardId][noteId];
    note.position = { x: 0, y: 0 };
    group.size = determineSize(group);
    group.items.push(noteId);
    updateGroup(boardId, group);
    saveNote(boardId, note);
  }
};
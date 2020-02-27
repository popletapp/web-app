import Poplet from '../..';

export default (boardId, newNote, returnNote = false) => {
  const state = Poplet.store.getState();
  let notes = [ ...Object.values(state.notesByBoard[boardId]), ...Object.values(state.groupsByBoard[boardId]) ];

  let firstAvailablePosition = null;
  let nextAvailablePosition = { x: 0, y: 0 };

  const positions = [];
  for (const note of notes) {
    if (!note) continue;
    if (!note.position) continue;
    positions.push({ ...note.position, total: note.position.x + note.position.y, id: note.id });
  }

  const map = positions.sort((a, b) => b.total - a.total);
  const furthestNote = notes.find(n => n.id === map[0].id);

  if (furthestNote) {
    nextAvailablePosition = { x: furthestNote.position.x + furthestNote.size.width + 5, y: furthestNote.position.y + furthestNote.size.height + 5 };
  }
  firstAvailablePosition = firstAvailablePosition || nextAvailablePosition;

  newNote.position = firstAvailablePosition;
  return returnNote ? newNote : firstAvailablePosition;
}


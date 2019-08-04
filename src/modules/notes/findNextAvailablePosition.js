import Poplet from '../..';
import { isNoteOverlapping } from './../';

export default async (boardId) => {
  const state = Poplet.store.getState();
  const notes = Object.values(state.notesByBoard[boardId]);

  let firstAvailablePosition = null;
  let nextAvailablePosition = { x: 0, y: 0 };
  for (const note of notes) {
    for (const compare of notes) {
      if (compare !== note) {
        if (isNoteOverlapping(note, compare)) {
          nextAvailablePosition = { x: note.position.x, y: note.position.y };
          firstAvailablePosition = firstAvailablePosition || nextAvailablePosition;
        }
      }
    }
  }
  return firstAvailablePosition;
}
;

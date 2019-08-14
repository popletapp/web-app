import Poplet from '../../';
import { isNoteInGroup } from './..';

export default (note, prevNote) => {
  const store = Poplet.store;
  const state = store.getState();
  const noteBeforePositionChange = prevNote;

  const setNewPosition = (a, b) => {
    const note = a;
    // If the current note equals the comparison note
    if (note === b) return;
    // If the comparison note is not in the same group as the note being tested
    const comparisonNoteInGroup = isNoteInGroup(b.id);
    const originalNoteInGroup = isNoteInGroup(a.id);
    if (originalNoteInGroup !== comparisonNoteInGroup) return;
    // If the position data for either note is not available
    if (!a.position || !b.position) return;

    const left = a.position.x + a.size.width <= b.position.x;
    const right = b.position.x + b.size.width <= a.position.x;
    const bottom = a.position.y + a.size.height <= b.position.y;
    const top = b.position.y + b.size.height <= a.position.y;
    const inside = !(left || right || top || bottom);

    if (inside) {
      const n = noteBeforePositionChange;
      const oldLeft = n.position.x + n.size.width <= b.position.x;
      const oldRight = b.position.x + b.size.width <= n.position.x;
      const oldBottom = n.position.y + n.size.height <= b.position.y;
      const oldTop = b.position.y + b.size.height <= n.position.y;

      if (oldLeft && !left) {
        return { x: b.position.x - b.size.width, y: a.position.y };
      } else if (oldRight && !right) {
        return { x: b.position.x + b.size.width, y: a.position.y };
      } else if (oldBottom && !bottom) {
        return { x: a.position.x, y: b.position.y - b.size.height };
      } else if (oldTop && !top) {
        return { x: a.position.x, y: b.position.y + b.size.height };
      }
    }
    return false;
  };

  let newPosition = note.position;
  // Means inside of the note
  for (const b of Object.values(state.notesByBoard[state.selectedBoard])) {
    const position = setNewPosition(note, b);
    if (position && position.x) {
      newPosition = position;
      note.position = newPosition;
    }
  }
  return newPosition === note.position ? false : newPosition;
};

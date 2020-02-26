import Poplet from '../../';
import { isNoteInGroup } from './..';

export default (note) => {
  const store = Poplet.store;
  const state = store.getState();

  if (!note) {
    return false;
  }

  const overlaps = (rect1, rect2) => {
    const obj = {
      left: rect1.position.x < rect2.position.x + rect2.size.width,
      right: rect1.position.x + rect1.size.width > rect2.position.x,
      bottom: rect1.position.y < rect2.position.y + rect2.size.height,
      top: rect1.position.y + rect1.size.height > rect2.position.y
    }

    return { overlapping: (obj.left && 
      obj.right && 
      obj.bottom && 
      obj.top), obj };
  }

  const notes = Object.values(state.notesByBoard[state.selectedBoard]);
  let overlapping = false;
  for (const b of notes) {
    // If the current note equals the comparison note
    if (note === b) continue;
    // If the comparison note is not in the same group as the note being tested
    const comparisonNoteInGroup = isNoteInGroup(b.id);
    const originalNoteInGroup = isNoteInGroup(note.id);
    if (originalNoteInGroup !== comparisonNoteInGroup) continue;
    // If the position data for either note is not available
    if (!note.position || !b.position) continue;

    const check = overlaps(note, b);
    if (check.overlapping) {
      overlapping = overlapping || check.overlapping;
    }
  }

  return overlapping;
};

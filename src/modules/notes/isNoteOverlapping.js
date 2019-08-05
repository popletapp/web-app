import Poplet from '../../';

export default (note) => {
  const store = Poplet.store;
  const state = store.getState();

  // Means inside of the note
  for (const comparison of Object.values(state.notesByBoard[state.selectedBoard])) {
    if (note === comparison) continue;
    if (!note.position || !comparison.position) continue;
    const inside = !((note.position.x + note.size.width) < comparison.position.x || note.position.x > (comparison.position.x + comparison.size.width) ||
    (note.position.y + note.size.height) < comparison.position.y || note.position.y > (comparison.position.y + comparison.size.height));
    if (inside) {
      return true;
    }
  }
  return false;
};

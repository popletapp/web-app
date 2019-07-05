import { INITIALIZE_NOTES, BEGIN_CREATE_NOTE, CREATE_NOTE, UPDATE_NOTE } from '../../constants/ActionTypes';

export const beginCreateNote = () => ({
  type: BEGIN_CREATE_NOTE
});

export const initializeNotes = (notes) => ({
  type: INITIALIZE_NOTES,
  notes
});


export const createNote = (note) => ({
  type: CREATE_NOTE,
  note
});

export const updateNote = (note) => ({
  type: UPDATE_NOTE,
  note
});
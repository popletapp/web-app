const notes = (state = [], action) => {
  switch (action.type) {
    case 'BEGIN_CREATE_NOTE':
      console.log('Begin create note')
      return [ ...state, { title: 'Title', content: 'Content' } ];
    case 'CREATE_NOTE':
      return [ ...state, action.note ];
    case 'UPDATE_NOTE':
      const array = state;
      const index = array.findIndex(note => note.id === action.note.id);
      array[index] = action.note;
      return array;
    case 'INITIALIZE_NOTES':
      return action.notes;
    default:
      return state;
  }
}

export default notes
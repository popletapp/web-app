export const notes = (state = {
  isFetching: false,
  items: []
}, action) => {
  switch (action.type) {
    case 'BEGIN_CREATE_NOTE': {
      return Object.assign({}, state, {
        items: [...state.items, { title: 'Title', content: 'Content' }]
      });
    }
    case 'END_CREATE_NOTE': {
      return Object.assign({}, state, {
        items: state.items.filter(note => note.id)
      });
    }
    case 'CREATE_NOTE': {
      return Object.assign({}, state, {
        items: [...state.items, action.note]
      });
    }
    case 'UPDATE_NOTE': {
      const modified = state;
      const index = modified.items.findIndex(note => note.id === action.note.id);
      modified.items[index] = action.note;
      return Object.assign({}, state, modified);
    }
    case 'DELETE_NOTE': {
      const old = state;
      old.items.filter(note => note.id !== action.noteId);
      return old;
    }

    case 'REQUEST_NOTES': {
      return Object.assign({}, state, {
        isFetching: false,
        items: action.notes
      });
    }
    case 'RECEIVE_NOTES': {
      return Object.assign({}, state, {
        isFetching: false,
        lastUpdated: action.receivedAt,
        items: action.notes
      });
    }

    default:
      return state;
  }
};

export const notesByBoard = (state = {}, action) => {
  switch (action.type) {
    case 'BEGIN_CREATE_NOTE': {
      console.log(action.board)
      return { ...state,
        [action.board]: {
          ...state[action.board],
          '-1': { title: 'Title', content: 'Content' }
        }
      };
    }
    case 'END_CREATE_NOTE': {
      const old = state;
      delete old[action.board]['-1'];
      return old;
    }
    case 'CREATE_NOTE':
    case 'UPDATE_NOTE': {
      if (action.note) {
        return { ...state,
          [action.board]: {
            ...state[action.board],
            [action.note.id]: action.note
          }
        };
      } else {
        return state;
      }
    }
    case 'DELETE_NOTE': {
      const old = state;
      delete old[action.board][action.noteId];
      return old;
    }
    case 'RECEIVE_NOTES':
    case 'REQUEST_NOTES':
      const notesWithBoards = notes(state[action.board], action);
      const standaloneNotes = {};
      if (notesWithBoards.items) {
        console.log(notesWithBoards);
        for (const note of notesWithBoards.items) {
          standaloneNotes[note.id] = note;
        }
      }
      return Object.assign({}, state, {
        [action.board.toString()]: standaloneNotes
      });
    default:
      return state;
  }
};

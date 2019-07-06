export const notes = (state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) => {
  console.log(action.type)
  switch (action.type) {
    case 'BEGIN_CREATE_NOTE':
      return Object.assign({}, state, {
        items: [ ...state.items, { title: 'Title', content: 'Content' } ]
      });
    case 'CREATE_NOTE':
      return Object.assign({}, state, {
        items: [ ...state.items, action.note ]
      });
    case 'UPDATE_NOTE':
      const old = state;
      const index = old.items.findIndex(note => note.id === action.note.id);
      old.items[index] = action.note;
      return old;
    case 'REQUEST_NOTES':
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: true
      })
    case 'RECEIVE_NOTES':
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.notes,
        lastUpdated: action.receivedAt
      })
    default:
      return state;
  }
}

export const notesByBoard = (state = {}, action) => {
  switch (action.type) {
    case 'INVALIDATE_NOTE':
    case 'RECEIVE_NOTES':
    case 'REQUEST_NOTES':
      return Object.assign({}, state, {
        [action.board.toString()]: notes(state[action.board], action)
      })
    default:
      return state
  }
}
export const selectedBoard = (state = {}, action) => {
  switch (action.type) {
    case 'CREATE_BOARD':
      return state;
    case 'SELECT_BOARD':
      console.log(action);
      return action.board; // Board ID
    default:
      return state;
  }
};

export const boards = (state = {}, action) => {
  switch (action.type) {
    case 'CREATE_BOARD':
      return { ...state, [action.board.id]: action.board };
    case 'RECEIVE_BOARDS':
    case 'POPULATE_BOARDS':
    case 'REQUEST_BOARDS':
      return action.array.reduce((obj, item) => {
        obj[item.id.toString()] = item;
        return obj;
      }, {});
    case 'CACHE_BOARD':
    case 'UPDATE_BOARD':
      return { ...state, [action.board.id]: action.board };
    default:
      return state;
  }
};

// 0 is default, 1 is list view
export const viewByBoard = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_VIEW':
      return Object.assign({}, state, {
        [action.board.toString()]: action.view
      });
    default:
      return state;
  }
};

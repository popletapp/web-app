const board = (state = {}, action) => {
  switch (action.type) {
    case 'CREATE_BOARD':
      return state
    case 'SWITCH_BOARD':
      state = action.board;
      return state;
    default:
      return state;
  }
}

export default board
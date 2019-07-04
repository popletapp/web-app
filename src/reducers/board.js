import Poplet from './../';

const board = (state = {}, action) => {
  console.log(state, action)
  switch (action.type) {
    case 'CREATE_BOARD':
      return state
    case 'SWITCH_BOARD':
      console.log(action.board)
      Poplet.boards.selected = action.board;
      state = Poplet.boards.selected;
      return state;
    default:
      return state;
  }
}

export default board
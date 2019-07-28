export const modals = (state = [], action) => {
  switch (action.type) {
    case 'MODAL_POP':
      return state.slice(0, -1);
    case 'MODAL_PUSH':
      return [...state, action];
    default:
      return state;
  }
};

export const popouts = (state = [], action) => {
  switch (action.type) {
    case 'POPOUT_POP':
      const array = state;
      array.pop();
      return array;
    case 'POPOUT_PUSH':
      return [...state, action];
    default:
      return state;
  }
};

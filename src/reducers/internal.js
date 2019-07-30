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

export const tooltips = (state = [], action) => {
  switch (action.type) {
    case 'CLEAR_TOOLTIPS':
      return [];
    case 'TOOLTIP_PUSH':
      return [...state, action.tooltip];
    default:
      return state;
  }
};

export const connected = (state = false, action) => {
  switch (action.type) {
    case 'CONNECT':
      return true;
    case 'DISCONNECT':
      return false;
    default:
      return state;
  }
};

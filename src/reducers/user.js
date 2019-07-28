export const user = (state = {}, action) => {
  switch (action.type) {
    case 'INITIALIZE_USER':
      return action.user;
    case 'UPDATE_USER':
      return { ...state, ...action.user };
    default:
      return state;
  }
};

export const users = (state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) => {
  switch (action.type) {
    case 'UPDATE_USER': {
      const old = state;
      const index = old.items.findIndex(user => user.id === action.user.id);
      old[index] = action.user;
      return old;
    }

    case 'REQUEST_USER': {
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: state.items
      });
    }
    case 'RECEIVE_USER': {
      if (action.user && action.user.id) {
        return Object.assign({}, state, {
          items: [...state.items, action.user]
        });
      } else {
        return state;
      }
    }

    case 'REQUEST_USERS': {
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: true,
        items: action.users
      });
    }
    case 'RECEIVE_USERS': {
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: action.receivedAt,
        items: action.users
      });
    }

    default:
      return state;
  }
};

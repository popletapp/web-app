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
  items: {}
}, action) => {
  switch (action.type) {
    case 'RECEIVE_USER':
    case 'UPDATE_USER': {
      if (action.user && action.user.id) {
        return Object.assign({}, state, {
          items: { ...state.items, [action.user.id]: action.user }
        });
      } else {
        return state;
      }
    }

    case 'REQUEST_USER': {
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: state.items
      });
    }

    case 'RECEIVE_USERS': {
      const users = {};
      if (action.users) {
        for (const user of action.users) {
          users[user.id] = {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            createdAt: user.createdAt
          };
        }
      }
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: action.receivedAt,
        items: users
      });
    }

    default:
      return state;
  }
};

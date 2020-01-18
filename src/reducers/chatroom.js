export const chatrooms = (state = {
  isFetching: false,
  items: []
}, action) => {
  switch (action.type) {
    case 'CREATE_CHATROOM': {
      return { ...state, items: [...state.items, action.chatroom] };
    }
    case 'UPDATE_CHATROOM': {
      const old = state;
      const index = old.items.findIndex(chatroom => chatroom.id === action.chatroom.id);
      old[index] = action.chatroom;
      return old;
    }
    case 'DELETE_CHATROOM': {
      const old = { ...state };
      delete old.items[action.chatroom.id.toString()];
      return old;
    }
    case 'REQUEST_CHATROOMS': {
      return Object.assign({}, state, {
        isFetching: false,
        items: action.chatrooms
      });
    }
    case 'RECEIVE_CHATROOMS': {
      if (action.chatrooms) {
        return Object.assign({}, state, {
          lastUpdated: action.receivedAt,
          isFetching: false,
          items: action.chatrooms
        });
      } else {
        return state;
      }
    }
    default:
      return state;
  }
};

export const chatroomsByBoard = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_CHATROOM':
    case 'CREATE_CHATROOM': {
      return { ...state, [action.board]: { ...(state[action.board] || {}), [action.chatroom.id]: action.chatroom } };
    }
    case 'DELETE_CHATROOM': {
      const old = state;
      delete old[action.board][action.chatroomId];
      return old;
    }
    case 'RECEIVE_CHATROOMS':
    case 'REQUEST_CHATROOMS':
      const chatroomsWithBoards = chatrooms(state[action.board], action);
      const standaloneChatrooms = {};
      if (chatroomsWithBoards.items) {
        for (const chatroom of chatroomsWithBoards.items) {
          standaloneChatrooms[chatroom.id] = chatroom;
        }
      }
      return Object.assign({}, state, {
        [action.board.toString()]: standaloneChatrooms
      });
    default:
      return state;
  }
};

export const chatroomComments = (state = {
  isFetching: false,
  items: []
}, action) => {
  switch (action.type) {
    case 'REQUEST_CHATROOM_COMMENTS': {
      return Object.assign({}, state, {
        isFetching: false,
        items: action.comments
      });
    }
    case 'RECEIVE_CHATROOM_COMMENTS': {
      return Object.assign({}, state, {
        isFetching: false,
        lastUpdated: action.receivedAt,
        items: action.comments
      });
    }
    default:
      return state;
  }
};

export const commentsByChatroom = (state = {}, action) => {
  switch (action.type) {
    case 'CREATE_CHATROOM_COMMENT': {
      return { ...state,
        [action.chatroom]: {
          ...state[action.chatroom],
          [action.comment.id]: action.comment
        }
      };
    }
    case 'CREATE_LOCAL_CHATROOM_COMMENT': {
      return { ...state,
        [action.chatroom]: {
          ...state[action.chatroom],
          [`local-${Math.random() * 100}`]: action.comment
        }
      };
    }
    case 'RECEIVE_CHATROOM_COMMENTS':
    case 'REQUEST_CHATROOM_COMMENTS':
      const chatroomWithComments = chatroomComments(state[action.chatroom], action);
      const standaloneChatrooms = {};
      if (chatroomWithComments.items) {
        for (const chatroom of chatroomWithComments.items) {
          standaloneChatrooms[chatroom.id] = chatroom;
        }
      }
      return Object.assign({}, state, {
        [action.chatroom]: standaloneChatrooms
      });
    default:
      return state;
  }
};

export const selectedBoard = (state = null, action) => {
  switch (action.type) {
    case 'CREATE_BOARD':
      return state;
    case 'SELECT_BOARD':
      return action.board; // Board ID
    default:
      return state;
  }
};

export const boards = (state = {}, action) => {
  switch (action.type) {
    case 'CREATE_BOARD':
    case 'JOIN_BOARD':
      return { ...state, [action.board.id]: action.board };
    case 'REQUEST_BOARDS':
      return state;
    case 'RECEIVE_BOARDS':
      return action.boards.reduce((obj, item) => {
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

export const ranks = (state = [], action) => {
  switch (action.type) {
    case 'ADD_RANK': {
      return [...state, action.rank];
    }
    case 'UPDATE_RANK': {
      const old = state;
      const index = old.items.findIndex(rank => rank.id === action.rank.id);
      old[index] = action.rank;
      return old;
    }
    case 'DELETE_RANK': {
      const old = state;
      old.filter(rank => rank.id !== action.rankId);
      return old;
    }
    case 'RECEIVE_BOARDS': {
      const ranks = [];
      for (const board of action.boards) {
        for (const rank of board.ranks) {
          ranks.push(rank);
        }
      }
      return Object.assign([], state, ranks);
    }
    default:
      return state;
  }
};

export const ranksByBoard = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_RANK':
    case 'ADD_RANK': {
      return { ...state, [action.board]: { ...(state[action.board] || {}), [action.rank.id]: action.rank } };
    }
    case 'DELETE_RANK': {
      const old = state;
      delete old[action.board][action.rankId];
      return old;
    }
    case 'RECEIVE_BOARDS': {
      const final = {};
      for (const board of action.boards) {
        final[board.id] = {};
        for (const rank of board.ranks) {
          final[board.id][rank.id] = rank;
        }
      }
      return Object.assign({}, state, final);
    }
    default:
      return state;
  }
};

export const groups = (state = {
  isFetching: false,
  items: []
}, action) => {
  switch (action.type) {
    case 'CREATE_GROUP': {
      return { ...state, items: [...state.items, action.group] };
    }
    case 'UPDATE_GROUP': {
      const old = state;
      const index = old.items.findIndex(group => group.id === action.group.id);
      old[index] = action.group;
      return old;
    }
    case 'DELETE_GROUP': {
      const old = state;
      delete old.items[action.groupId.toString()];
      return old;
    }
    case 'REQUEST_GROUPS': {
      return Object.assign({}, state, {
        isFetching: false,
        items: action.groups
      });
    }
    case 'RECEIVE_GROUPS': {
      if (action.groups) {
        return Object.assign({}, state, {
          lastUpdated: action.receivedAt,
          isFetching: false,
          items: action.groups
        });
      } else {
        return state;
      }
    }
    default:
      return state;
  }
};

export const groupsByBoard = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_GROUP':
    case 'CREATE_GROUP': {
      return { ...state, [action.board]: { ...(state[action.board] || {}), [action.group.id]: action.group } };
    }
    case 'DELETE_GROUP': {
      const old = state;
      delete old[action.board][action.groupId];
      return old;
    }
    case 'RECEIVE_GROUPS':
    case 'REQUEST_GROUPS':
      const groupsWithBoards = groups(state[action.board], action);
      const standaloneGroups = {};
      if (groupsWithBoards.items) {
        for (const group of groupsWithBoards.items) {
          standaloneGroups[group.id] = group;
        }
      }
      return Object.assign({}, state, {
        [action.board.toString()]: standaloneGroups
      });
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

export const selectionArea = (state = {}, action) => {
  switch (action.type) {
    case 'BEGIN_SELECTION':
    case 'END_SELECTION':
      return Object.assign({}, state, action.selection);
    default:
      return state;
  }
};

export const members = (state = {
  isFetching: false,
  items: []
}, action) => {
  switch (action.type) {
    case 'REQUEST_MEMBERS': {
      return Object.assign({}, state, {
        didInvalidate: true,
        items: action.members
      });
    }
    case 'RECEIVE_MEMBERS': {
      return Object.assign({}, state, {
        isFetching: false,
        lastUpdated: action.receivedAt,
        items: action.members
      });
    }
    default:
      return state;
  }
};

export const membersByBoard = (state = {}, action) => {
  switch (action.type) {
    case 'RECEIVE_MEMBERS':
    case 'REQUEST_MEMBERS':
      const membersWithBoards = members(state[action.board], action);
      const standaloneMembers = {};
      if (membersWithBoards.items) {
        for (const member of membersWithBoards.items) {
          standaloneMembers[member.id] = member;
        }
      }
      return Object.assign({}, state, {
        [action.board.toString()]: standaloneMembers
      });
    default:
      return state;
  }
};

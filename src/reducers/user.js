export const user = (state = {}, action) => {
  switch (action.type) {
    case 'INITIALIZE_USER':
      return action.user;
    case 'UPDATE_USER':
      return { ...state, ...action.user };
    default:
      return state;
  }
}
import Poplet from '../..';
import { getUser } from '../../actions/user';

export default (userID) => {
  const store = Poplet.store;
  const state = store.getState();
  if (state.users.items[userID]) {
    return state.users.items[userID];
  } else {
    store.dispatch(getUser(userID));
    return state.users.items[userID] || null;
  }
};

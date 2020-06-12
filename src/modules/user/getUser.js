import Poplet from '../..';
import { getUser } from '../../actions/user';

export default async (userID) => {
  const store = Poplet.store;
  let state = store.getState();
  if (state.users.items[userID]) {
    return state.users.items[userID];
  } else {
    await store.dispatch(await getUser(userID));
    state = store.getState();
    return state.users.items[userID] || null;
  }
};

import Poplet from '../..';
import { getUser } from '../../actions/user';

export default async (userID) => {
  const store = Poplet.store;
  await store.dispatch(getUser(userID));
  const state = store.getState();
  return state.users[userID];
};

import { INITIALIZE_USER, UPDATE_USER, RECEIVE_USERS, RECEIVE_USER, REQUEST_USER } from '../../constants/ActionTypes';
import axios from 'axios';

export const initializeUser = (user) => ({
  type: INITIALIZE_USER,
  user
});

export const updateUser = (user) => ({
  type: UPDATE_USER,
  user
});

export const receiveUsers = (users) => ({
  type: RECEIVE_USERS,
  users,
  receivedAt: Date.now()
});

export const requestUser = user => ({
  type: REQUEST_USER,
  user
});

export const receiveUser = (user) => ({
  type: RECEIVE_USER,
  user,
  receivedAt: Date.now()
});

export const fetchUser = userId => dispatch => {
  dispatch(requestUser(userId));
  return axios.get(`/users/${userId}`)
    .then(res => dispatch(receiveUser(res.data)))
    .catch(() => dispatch(receiveUser(null)));
};

function shouldFetchUser (state, userId) {
  const users = state.users;
  const user = users[userId];
  if (!users) {
    return true;
  } else if (!user) {
    return true;
  } else {
    return false;
  }
}

export function getUser (userId) {
  return (dispatch, getState) => {
    if (shouldFetchUser(getState(), userId)) {
      return dispatch(fetchUser(userId));
    } else {
      return Promise.resolve(getState().users[userId]);
    }
  };
}

import { INITIALIZE_USER, UPDATE_USER } from '../../constants/ActionTypes';

export const initializeUser = (user) => ({
  type: INITIALIZE_USER,
  user
});

export const updateUser = (user) => ({
  type: UPDATE_USER,
  user
});

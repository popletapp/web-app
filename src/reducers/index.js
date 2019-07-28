import { combineReducers } from 'redux';
import {
  selectedBoard,
  boards,
  viewByBoard,
  selectionArea,
  members,
  membersByBoard,
  groups,
  groupsByBoard,
  ranks,
  ranksByBoard,
  chatrooms,
  chatroomsByBoard
} from './board';
import { notesByBoard, notes } from './notes';
import { user, users } from './user';
import { modals } from './internal';

const rootReducer = combineReducers({
  boards,
  selectedBoard,
  notes,
  notesByBoard,
  viewByBoard,
  user,
  selectionArea,
  groups,
  groupsByBoard,
  users,
  modals,
  members,
  membersByBoard,
  ranks,
  ranksByBoard,
  chatrooms,
  chatroomsByBoard
});

export default rootReducer;

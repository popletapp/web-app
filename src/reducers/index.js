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
  ranksByBoard
} from './board';
import { notesByBoard, notes } from './notes';
import { user, users } from './user';
import {
  chatrooms,
  chatroomsByBoard,
  chatroomComments,
  commentsByChatroom
} from './chatroom';
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
  chatroomsByBoard,
  chatroomComments,
  commentsByChatroom
});

export default rootReducer;

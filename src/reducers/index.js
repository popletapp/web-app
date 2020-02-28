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
  labels,
  labelsByBoard
} from './board';
import { notesByBoard, notes, zoomLevel } from './notes';
import { user, users } from './user';
import { blogPosts } from './blog';
import {
  chatrooms,
  chatroomsByBoard,
  chatroomComments,
  commentsByChatroom
} from './chatroom';
import { modals, connected, tooltips, popouts, dev } from './internal';

const rootReducer = combineReducers({
  connected,
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
  labels,
  labelsByBoard,
  chatrooms,
  chatroomsByBoard,
  chatroomComments,
  commentsByChatroom,
  tooltips,
  popouts,
  dev,
  zoomLevel,
  blogPosts
});

export default rootReducer;

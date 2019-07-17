import { combineReducers } from 'redux';
import { selectedBoard, boards, viewByBoard } from './board';
import { notesByBoard, notes } from './notes';
import { user } from './user';

const rootReducer = combineReducers({ boards, selectedBoard, notes, notesByBoard, viewByBoard, user });

export default rootReducer;

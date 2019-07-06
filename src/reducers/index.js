import { combineReducers } from 'redux';
import { selectedBoard, boards } from './board';
import { notesByBoard, notes } from './notes';

const rootReducer = combineReducers({ boards, selectedBoard, notes, notesByBoard })

export default rootReducer;
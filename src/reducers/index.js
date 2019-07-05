import { combineReducers } from 'redux';
import board from './board';
import notes from './notes';

const rootReducer = combineReducers({ board, notes })

export default rootReducer;
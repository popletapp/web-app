import {
  REQUEST_CHATROOMS,
  RECEIVE_CHATROOMS,
  CREATE_CHATROOM,
  UPDATE_CHATROOM,
  DELETE_CHATROOM,
  CREATE_CHATROOM_COMMENT
} from '../../constants/ActionTypes';
import axios from 'axios';

export const createChatroom = (boardID, chatroom) => ({
  type: CREATE_CHATROOM,
  boardID,
  chatroom
});

export const deleteChatroom = (boardID, chatroomID) => ({
  type: DELETE_CHATROOM,
  boardID,
  chatroomID
});

export const updateChatroom = (boardID, chatroom) => ({
  type: UPDATE_CHATROOM,
  boardID,
  chatroom
});

export const requestChatrooms = board => ({
  type: REQUEST_CHATROOMS,
  board
});

export const receiveChatrooms = (board, chatrooms) => ({
  type: RECEIVE_CHATROOMS,
  board,
  chatrooms,
  receivedAt: Date.now()
});

export const fetchChatrooms = boardId => dispatch => {
  dispatch(requestChatrooms(boardId));
  return axios.get(`/boards/${boardId}/chatrooms`)
    .then(res => dispatch(receiveChatrooms(boardId, res.data)))
    .catch(() => dispatch(receiveChatrooms(boardId, [])));
};

function shouldFetchChatrooms (state, boardId) {
  const chatrooms = state.chatroomsByBoard[boardId];
  if (!chatrooms) {
    return true;
  } else if (chatrooms.isFetching) {
    return false;
  } else {
    return true;
  }
}

export function getChatrooms (boardId) {
  return (dispatch, getState) => {
    if (shouldFetchChatrooms(getState(), boardId)) {
      return dispatch(fetchChatrooms(boardId));
    } else {
      return Promise.resolve(getState().groupsByBoard[boardId].items);
    }
  };
}

export const createChatroomComment = (boardID, chatroomID, comment) => ({
  type: CREATE_CHATROOM_COMMENT,
  boardID,
  chatroomID,
  comment
});

import {
  REQUEST_CHATROOMS,
  RECEIVE_CHATROOMS,
  CREATE_CHATROOM,
  UPDATE_CHATROOM,
  DELETE_CHATROOM,
  CREATE_CHATROOM_COMMENT,
  CREATE_LOCAL_CHATROOM_COMMENT,
  REQUEST_CHATROOM_COMMENTS,
  RECEIVE_CHATROOM_COMMENTS
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
      return Promise.resolve(getState().chatroomsByBoard[boardId].items);
    }
  };
}

export const createChatroomComment = (chatroom, comment) => ({
  type: CREATE_CHATROOM_COMMENT,
  chatroom,
  comment
});

export const createLocalChatroomComment = (chatroom, comment) => ({
  type: CREATE_LOCAL_CHATROOM_COMMENT,
  chatroom,
  comment
});


export const fetchChatroomComments = chatroomId => dispatch => {
  dispatch(requestChatroomComments(chatroomId));
  return axios.get(`/chatrooms/${chatroomId}/comments`)
    .then(res => dispatch(receiveChatroomComments(chatroomId, res.data)))
    .catch(() => dispatch(receiveChatroomComments(chatroomId, [])));
};

function shouldFetchChatroomComments (state, chatroomId) {
  const chatroomComments = state.commentsByChatroom[chatroomId];
  if (!chatroomComments) {
    return true;
  } else if (chatroomComments.isFetching) {
    return false;
  } else {
    return true;
  }
}

export const requestChatroomComments = chatroom => ({
  type: REQUEST_CHATROOM_COMMENTS,
  chatroom
});

export const receiveChatroomComments = (chatroom, comments) => ({
  type: RECEIVE_CHATROOM_COMMENTS,
  chatroom,
  comments,
  receivedAt: Date.now()
});

export function getChatroomComments (chatroomId) {
  return (dispatch, getState) => {
    if (shouldFetchChatroomComments(getState(), chatroomId)) {
      return dispatch(fetchChatroomComments(chatroomId));
    } else {
      return Promise.resolve(getState().commentsByChatroom[chatroomId].items);
    }
  };
}
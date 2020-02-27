import {
  REQUEST_POSTS,
  RECEIVE_POSTS
} from '../../constants/ActionTypes';
import axios from 'axios';

export const requestPosts = () => ({
  type: REQUEST_POSTS
});

export const receivePosts = (posts) => ({
  type: RECEIVE_POSTS,
  posts
});

export const fetchPosts = () => async dispatch => {
  dispatch(requestPosts());
  try {
    const res = await axios.get(`/blog/posts`).catch(console.log);
    return dispatch(receivePosts(res.data));
  } catch (e) {
    return dispatch(receivePosts([]));
  }
};

function shouldFetchPosts () {
  return true;
}

export function getLastBlogPosts () {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState())) {
      return dispatch(fetchPosts());
    } else {
      return Promise.resolve(getState().blogPosts);
    }
  };
}
export const blogPosts = (state = {}, action) => {
  switch (action.type) {
    case 'REQUEST_POSTS':
      return state;
    case 'RECEIVE_POSTS':
      return action.posts.reduce((obj, item) => {
        obj[item.id.toString()] = item;
        return obj;
      }, {});
    default:
      return state;
  }
};
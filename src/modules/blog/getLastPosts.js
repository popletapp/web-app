import Poplet from '../..';
import { getLastBlogPosts } from '../../actions/blog';
import axios from 'axios';

export default async () => {
  const store = Poplet.store;
  const value = await store.dispatch(getLastBlogPosts());
  return value.posts;
};

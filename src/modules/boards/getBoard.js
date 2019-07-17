import axios from 'axios';
import Poplet from '../../';

export default async (id) => {
  const store = Poplet.store;
  const contents = store.getState();
  if (contents.boards[id]) {
    // Return cached result
    return Promise.resolve(contents.boards[id]);
  } else {
    // Grab from API
    return await axios.get(`/boards/${id}`)
      .then(res => res.data)
      .catch(err => err)
  }
}

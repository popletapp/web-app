import axios from 'axios';

export default async (boardID, id, filter) => {
  return await axios.get(`/boards/${boardID}/notes/${id}/comments`, filter).then(res => res.data);
};

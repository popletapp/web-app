import axios from 'axios';

export default async (boardID) => {
  return axios.post(`/boards/${boardID}/invites`)
    .then(res => res.data);
};

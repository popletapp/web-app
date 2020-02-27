import axios from 'axios';
import { permissions } from './../../util';

export default async (boardID) => {
  if (!permissions.has(['MODERATOR', 'INVITE_MEMBERS'])) return false;
  return axios.post(`/boards/${boardID}/invites`)
    .then(res => res.data);
};

import Poplet from '../../';
import { updateUser } from '../../actions/user';
import axios from 'axios';

export default async (id, avatar, endpoint = 'users') => {
  const store = Poplet.store;
  const file = new Blob([avatar], { name: avatar.name, type: 'image/png' });
  const data = new FormData();
  data.append('file', file, avatar.name);
  const value = await axios.post(`${Poplet.API.API_DOMAIN}/avatars/${id}`, data, {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`
    }
  }).then(res => res.data).catch(console.log)
  await store.dispatch(updateUser(id));
  const req = await axios.patch(`/${endpoint}/${id}`, { avatar: value.filename }).then(res => res.data);
  return req;
};

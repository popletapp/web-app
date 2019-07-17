import axios from 'axios';
import established from './established';

export default async () => {
  await axios.get('/gateway/connect')
    .then(() => {
      established();
      Promise.resolve();
    })
    .catch((err) => {
      Promise.reject(new Error(err));
    });
};

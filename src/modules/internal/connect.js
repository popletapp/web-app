import axios from 'axios';
import established from './established';

export default async () => {
  await axios.get('/gateway/connect')
    .then(() => {
      established()
        .then(() => {
          Promise.resolve();
        });
    })
    .catch((err) => {
      throw new Error(err);
    });
};

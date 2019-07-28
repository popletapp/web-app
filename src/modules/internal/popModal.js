import Poplet from '../..';
import { popTopModal } from '../../actions/internal';

export default async () => {
  const store = Poplet.store;
  store.dispatch(popTopModal());
};

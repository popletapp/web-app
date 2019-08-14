import Poplet from '../..';
import { removePopout } from '../../actions/internal';

export default () => {
  const store = Poplet.store;
  store.dispatch(removePopout());
};

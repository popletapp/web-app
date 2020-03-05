import Poplet from '../..';
import { removeContextMenu } from '../../actions/internal';

export default () => {
  const store = Poplet.store;
  store.dispatch(removeContextMenu());
};

import Poplet from '../..';
import { createContextMenu } from '../../actions/internal';

export default (id = 'contextmenu', items, position) => {
  const store = Poplet.store;
  if (id) {
    store.dispatch(createContextMenu(id, items, position));
  }
};

import Poplet from '../..';
import { createModal } from '../../actions/internal';

export default (id, modal) => {
  const store = Poplet.store;
  if (id || modal) {
    if (!modal) {
      modal = id;
      id = modal.constructor.name;
    }
    store.dispatch(createModal(id, modal));
  }
};

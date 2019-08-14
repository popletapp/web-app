import Poplet from '../..';
import { createPopout } from '../../actions/internal';

export default (id, popout, options) => {
  const store = Poplet.store;
  if (id || popout) {
    if (!popout) {
      popout = id;
      id = 'popout';
    }
    store.dispatch(createPopout(id, popout, options));
  }
};

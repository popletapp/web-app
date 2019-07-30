import Poplet from '../..';
import { createTooltip } from '../../actions/internal';

export default (id, tooltip) => {
  const store = Poplet.store;
  if (id || tooltip) {
    if (!tooltip) {
      tooltip = id;
      id = 'tooltip';
    }
    store.dispatch(createTooltip(id, tooltip));
  }
};

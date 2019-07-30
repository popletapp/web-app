import Poplet from '../..';
import { clearTooltips } from '../../actions/internal';

export default () => {
  const store = Poplet.store;
  store.dispatch(clearTooltips());
};

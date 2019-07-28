import Poplet from '../..';
import { endSelection } from '../../actions/board';

export default async (selection) => {
  const store = Poplet.store;
  store.dispatch(endSelection(selection));
};

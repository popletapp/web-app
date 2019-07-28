import Poplet from '../..';
import { beginSelection } from '../../actions/board';

export default async (selection) => {
  const store = Poplet.store;
  store.dispatch(beginSelection(selection));
};

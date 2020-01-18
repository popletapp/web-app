import Poplet from '../..';
import { adjustZoomLevel } from '../../actions/note';

export default async (boardID, amount) => {
  const store = Poplet.store;
  await store.dispatch(adjustZoomLevel(boardID, amount));
  // TODO: add to user settings and save
};

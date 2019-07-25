import Poplet from '../..';

export default async (boardID, note) => {
  Poplet.ws.emit('message', { type: 'UPDATE_NOTE', board: boardID, note });
};

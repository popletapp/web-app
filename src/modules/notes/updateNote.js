import Poplet from '../..';

export default async (boardID, note) => {
  // Handle validation server-side
  Poplet.ws.emit('message', { type: 'UPDATE_NOTE', board: boardID, note });
};

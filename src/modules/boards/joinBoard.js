import Poplet from '../..';
import { joinBoard } from '../../actions/board';
import axios from 'axios';

export default async (code, userID) => {
  const store = Poplet.store;
  const invite = await axios.get(`/invites/${code}`);
  if (invite) {
    const board = await axios.put(`/boards/${invite.board}/members/${userID}`, { invite: invite.code }).then(res => res.data);
    if (board) {
      await store.dispatch(joinBoard(board));
      return board;
    } else {
      return null;
    }
  }
};

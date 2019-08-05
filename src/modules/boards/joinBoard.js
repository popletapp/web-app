import Poplet from '../..';
import { joinBoard, addMember } from '../../actions/board';
import axios from 'axios';

export default async (code, userID) => {
  const store = Poplet.store;
  const invite = await axios.get(`/invites/${code}`).then(res => res.data);
  if (invite) {
    const board = await axios.get(`/boards/${invite.board}`).then(res => res.data);
    const member = await axios.put(`/boards/${invite.board}/members/${userID}`, { invite: invite.code }).then(res => res.data);
    console.log(member, board);
    if (board && member) {
      Poplet.ws.emit('message', addMember(board.id, member));
      await store.dispatch(joinBoard(board));
      return board;
    } else {
      return null;
    }
  }
};

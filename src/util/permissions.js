import Poplet from './../';

const Permissions = {
  1: 'MANAGE_NOTES',
  2: 'MANAGE_MEMBERS',
  4: 'MOVE_NOTES',
  8: 'MODERATOR',
  16: 'ADMINISTRATOR',
  32: 'VIEW_CHATROOMS',
  64: 'ADD_COMMENTS',
  128: 'SEND_CHATROOM_MESSAGES',
  256: 'INVITE_MEMBERS',
  512: 'KICK_MEMBERS',
  1024: 'BAN_MEMBERS',
  2048: 'MANAGE_BOARD'
}
// Make it so all permissions are accessible by their bitfield and name
for (const permission in Permissions) {
  Permissions[Permissions[permission]] = permission;
}

const DEVELOPER_IDS = [
  '222082558807022',
  '2086124001',
  '2506731637'
]

class PermissionsHandler {
  get PERMISSIONS () {
    return Permissions;
  }

  static isDeveloper (id) {
    return DEVELOPER_IDS.includes(id);
  }

  get () {
    const store = Poplet.store;
    const state = store.getState();
    this.member = (state.membersByBoard[state.selectedBoard] || {})[state.user.id];
    this.board = state.boards[state.selectedBoard];
    let bitfield = 0;

    if (!this.member) return {};

    for (let rank of this.member.ranks) {
      rank = state.ranks[rank];
      if (!rank) continue;
      bitfield |= rank.permissions;
    }

    if (PermissionsHandler.isDeveloper(this.member.id)) {
      return this.PERMISSIONS;
    }

    if ((this.board.owner || this.board.members[0]) === this.member.id) {
      return this.PERMISSIONS;
    }

    if (bitfield & this.PERMISSIONS.ADMINISTRATOR) {
      return this.PERMISSIONS;
    }

    const has = {};
    for (const permission in this.PERMISSIONS) {
      has[permission] = !!(bitfield & permission);
    }
    // Make it so all permissions are accessible by their bitfield and name
    for (const permission in has) {
      has[this.PERMISSIONS[permission]] = has[permission];
    }
    return has;
  }
  
  has (permission) {
    const all = this.get();
    if (Array.isArray(permission)) {
      let obj = {};
      for (const perm of permission) {
        obj = all[perm];
      }
      return obj;
    }
    if (all[permission] === undefined) {
      return null; // permission doesn't exist
    }
    return all[permission];
  }
}

export default new PermissionsHandler();
export { Permissions, PermissionsHandler };
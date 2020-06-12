export default {
  // If no title is present on the note ({note.title} = note #{note.ref})
  FRIEND_REQUEST_ACCEPTED: 'FRIEND_REQUEST_ACCEPTED',
  FRIENDSHIP_CREATED: 'FRIENDSHIP_CREATED',
  // ex. You were assigned to "{note.title}"
  ASSIGNED_TO_NOTE: 'ASSIGNED_TO_NOTE',
  // ex. "{note.title}" is due in {time}
  DUE_DATE_UPCOMING: 'DUE_DATE_UPCOMING',
  // ex. {user} mentioned you in "{note.title}"
  MENTIONED_IN_NOTE: 'MENTIONED_IN_NOTE',
  // ex. {user} created a new note in {board}
  NOTE_CREATED: 'NOTE_CREATED',
  // ex. {user} updated "{note.title}" in {board}
  NOTE_MODIFIED: 'NOTE_MODIFIED',
  // ex. {user} created a new public board called {board}
  BOARD_CREATED_BY_FRIEND: 'BOARD_CREATED_BY_FRIEND',
  // ex. {user} updated the avatar of {board}
  BOARD_MODIFIED: 'BOARD_MODIFIED',
}
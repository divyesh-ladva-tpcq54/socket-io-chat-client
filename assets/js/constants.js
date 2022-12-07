var SocketEvents = {
  privateMessage: 'private-message',
  groupMessage: 'group-message',
  groupCreate: 'group-create',
  groupMemberAdd: 'group-member-add',
  broadcastMessage: 'broadcast-message',
  connection: 'connect',
  disconnected: 'disconnected',
  forceServerDisconnect: 'force-server-disconnect',
  systemMessage: 'system-message',
  logout: 'logout'
};

var Messages = {
  userLoggedOut: 'user logged out',
  invalidUsername: 'invalid username',
  userNotFound: 'user not found!'
}

var backendUrl = 'http://localhost:3344';
var socketIOUrl = 'http://127.0.0.1:3434';

var privateMessageContainerRootId = "personal-chats";
var groupMessageContainerRootId = "group-chats";
var systemMessageContainerRootId = "user-info";
var messageContainerClass = "messages";

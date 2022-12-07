function User(user) {
  this.id = user.id;
  this.username = user.username;
}

function SocketManager() {
  this.socket;

  this.connectSocket = function (queryObj) {
    this.socket = io(socketIOUrl, {
      ...queryObj,
    });
    this.bindListeners();
  }

  this.bindListeners = function () {
    this.socket.on(SocketEvents.disconnected, function () {
      disconnectSocket()
    })

    this.socket.on(SocketEvents.systemMessage, function (data) {
      appendMessageHtml(getMessageHtml(data.messages), getSystemMessageContainer())
    })

    this.socket.on(SocketEvents.forceServerDisconnect, function (data) {
      appendMessageHtml(getMessageHtml(data.messages), getSystemMessageContainer())
    })

    this.socket.on(SocketEvents.privateMessage, function (data) {
      appendMessageHtml(getMessageHtml(data.messages), getPrivateMessageContainer())
    });

    this.socket.on(SocketEvents.groupMessage, function (data) {
      appendMessageHtml(getMessageHtml(data.messages), getGroupMessageContainer())
    });
  }

  this.emitEvent = function (event, data) {
    this.socket.emit(event, data);
  }

  this.disconnectSocket = function() {
    this.socket = null;
  }
}

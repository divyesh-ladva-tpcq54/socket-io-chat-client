function connectSocket(queryObj) {
  socketManager.connectSocket(queryObj);
}

function disconnectSocket() {
  socketManager.disconnectSocket();
}

function initUser(userData) {
  user = new User(userData);
}

function emitEvent(event, data) {
  socketManager.emitEvent(event, data);
}

function clearUser() {
  user = null;
}

function createCookie(name, value, days) {
  var expires;

  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
  } else {
      expires = "";
  }
  document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) +"; SameSite: false; "+ expires + "; path=/";
}

function readCookie(name) {
  var nameEQ = encodeURIComponent(name) + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ')
          c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0)
          return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name, "", -1);
}

function setUserDataCookies(user) {
  createCookie("userId", user.id);
  createCookie("username", user.username);
}

function unsetUserDataCookies() {
  eraseCookie("userId");
  createCookie("username");
}

function getForwardedMessageHTML(id, message, from) {

}

function appendMessageHtml(messageHTML, parentContainerId) {
  $(parentContainerId).append(messageHTML);
}

function getPrivateMessageContainer() {
  var e = "div#" + privateMessageContainerRootId + " > ." + messageContainerClass; 
  return e;
}

function getSystemMessageContainer() {
  var e = "div#" + systemMessageContainerRootId + " > ." + messageContainerClass; 
  return e;
}

function createSenderMessageHtml(name) {
  var element = document.createElement('span');
  element.className = "chat-name-tag";
  element.innerText = name;
  
  return element;
}

function createForwardedMessageNotifierHtml() {
  // <span class="forwarded-message-tag">forwared message</span>

  var element = document.createElement('span');
  element.className = "forwarded-message-tag";
  element.innerText = 'forwarded';

  return element;
}

function createForwardInputHtml(messageId) {
  // <span class="forward-message-input-group"> <input type="text" name="" id="" class="forward-message-input" /> <button id="">Forward</button> </span>

  // forward button div html
  var element = document.createElement('span');
  element.className = "forward-message-input-group";

  // text input html
  var input = document.createElement('input');
  input.type = 'text';
  input.dataset.messageId = messageId;
  input.className = 'forward-forward-message';
  element.append(input);

  // forward button html
  var button = document.createElement('button');
  button.type = 'text';
  button.dataset.messageId = messageId;
  button.className = 'forward-forward-message';
  element.append(button);

  return element;
}

function createMessageHtml(message) {
  // main message holder
  var messageHolder = document.createElement('div');
  messageHolder.className = 'message';
  messageHolder.dataset.id = message.id;
  messageHolder.innerText = message.message;

  // message sender tag
  messageHolder.append(createSenderMessageHtml(message.sender.username));
  
  // forwareded message tag
  if (message.isForwarded) {
    messageHolder.prepend(createForwardedMessageNotifierHtml());
  }
  
  // show forward option only if 
  if (message.sender.isAdmin) {
    message.append(createForwardInputHtml(message.id))
  }

  return messageHolder;
}

function getMessageHtml(messageData) {
  var messageHtml = document.createElement("div");

  messageData.forEach(function (message) {
    messageHtml.append(createMessageHtml(message));
  });

  return messageHtml.innerHTML;
}

function validateRegisterUser(username) {
  if (!username) {
    return false;
  }

  if (!username.trim()) {
    return false;
  }

  return true;
}

function registerUserAjax(username) {
  $.ajax({
    xhr: function () { 
      var xhr = new window.XMLHttpRequest();
      return xhr;
    },
    type: "POST",
    url: backendUrl + "/auth/register",
    contentType: 'application/json',
    data: JSON.stringify({ username: username }),
    success: function (data, status, xhr) {
      alert(data.message);
    },
    error: function (xhr, status, error) {
      alert(error);
    }
  });
}

function registerUser(username) {
  if (!validateRegisterUser(username)) {
    alert(Messages.invalidUsername);
    return;
  }

  registerUserAjax(username);
}

function loginUserAjax(username) {
  $.ajax({
    xhr: function () { 
      var xhr = new window.XMLHttpRequest();
      return xhr;
    },
    type: "POST",
    url: backendUrl + "/auth/login",
    contentType: 'application/json',
    data: JSON.stringify({ username: username }),
    success: function (data, status, xhr) {
      if (data.user && data.user.id) {
        connectSocket({ query: `userId=${data.user.id}` });
        initUser(data.user);
        setUserDataCookies(data.user);
      } else {
        alert(Messages.userNotFound)
      }
    },
    error: function (xhr, status, error) {
      alert(error);
    }
  });
}

function loginUser(username) {
  if (!validateRegisterUser(username)) {
    alert(Messages.invalidUsername);
    return;
  }

  loginUserAjax(username);
}

function logoutUser() {
  if (!user) {
    alert("User already logged out")
    return;
  }

  emitEvent(SocketEvents.logout);
  clearUser();
  unsetUserDataCookies()
}

function validateMessage(message) {
  if (!message) {
    return false;
  }

  if (!message.trim()) {
    return false;
  }

  return true;
}

function validateSender(username) {
  if (!username) {
    return false;
  }

  if (!username.trim()) {
    return false;
  }

  return true;
}

function forwardMessageToGroup(messageId, groupName) {

}

function forwardMessageToPrivateUser(messageId, username) {

}

function sendPrivateMessageAjax(message, to) {
  var data = {
    message, to, sender: user
  }

  emitEvent(SocketEvents.privateMessage, data);
}


function sendPrivateMessage(message, to) {
  if (!validateMessage(message)) {
    alert("Invalid Message");
    return;
  }

  if (!validateSender(to)) {
    alert("Other username is invalid");
    return;
  }

  if (!user) {
    alert("user not logged in");
    return;
  }

  sendPrivateMessageAjax(message, to);
}

function sendGroupMessage(message, groupName) {

}

function createGroup(name) {

}

function joinGroup(name) {

}

function leaveGroup(name) {

}

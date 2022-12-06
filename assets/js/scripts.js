$(function () {
  socketManager = new SocketManager();

  // register button click event
  $("#control-user-create").on("click", function (e) {
    e.preventDefault();

    registerUser($("#control-username").val());
  });

  // login button click event
  $("#control-user-login").on("click", function (e) {
    e.preventDefault();

    loginUser($("#control-username").val());
  });

  // logout button click event
  $("#control-user-logout").on("click", function (e) {
    e.preventDefault();

    logoutUser($("#control-username").val());
  });

  // private message button click event
  $("#chats-send-personal-message").on("click", function (e) {
    e.preventDefault();

    sendPrivateMessage($("#chats-pm-chat-message").val(), $("#chats-pm-chat-name").val());
  })
})

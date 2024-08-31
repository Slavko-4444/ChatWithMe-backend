const io = require("socket.io")(8000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let users = [];
const addUser = (userInfo, socketId) => {
  const checkUser = users.some((usr) => usr.id === userInfo.id);
  const { id, ...userData } = userInfo;
  if (!checkUser) users.push({ id, userData, socketId });
};

const findFriend = (id) => {
  return users.find((u) => u.id === id);
};

const userRemove = (socketId) => {
  users = users.filter((u) => u.socketId !== socketId);
};

module.exports = function (io) {
  io.on("connection", (socket) => {
    socket.on("addUser", (userInfo) => {
      if (userInfo.id) addUser(userInfo, socket.id);
      io.emit("getActives", users);
    });

    socket.on("typingMessage", (data) => {
      const user = findFriend(data.receiverId);

      if (user && data.cleanTypeDots === false)
        socket.to(user.socketId).emit("typingMessageGet", {
          senderId: data.senderId,
          receiverId: data.receiverId,
          msg: data.msg,
          cleanTypeDots: false,
        });
      else if (user && data.cleanTypeDots === true)
        socket.to(user.socketId).emit("typingMessageGet", {
          senderId: data.senderId,
          receiverId: data.receiverId,
          senderId: data.senderId,
          cleanTypeDots: true,
        });
    });

    socket.on("sendMessage", (data) => {
      const user = findFriend(data.receiverId);

      if (user !== undefined) {
        socket.to(user.socketId).emit("getMessage", {
          senderId: data.senderId,
          senderName: data.senderName,
          receiverId: data.receiverId,
          createdAt: data.time,
          status: "seen",
          updatedAt: data.time,
          message: {
            text: data.message.text,
            image: data.message.image,
          },
        });
      }
    });

    socket.on("seenMessage", (data) => {
      let foundedUserToSend = findFriend(data.senderId);
      if (foundedUserToSend)
        io.to(foundedUserToSend.socketId).emit("updateMessageStatus", data);
    });

    socket.on("disconnect", () => {
      // console.log("Client disconnected");
      userRemove(socket.id);
      io.emit("getUser", users);
    });
  });
};

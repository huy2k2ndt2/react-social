const axios = require("axios");
axios.defaults.baseURL = "http://localhost:8080/v1/api";

// const { instrument } = require("@socket.io/admin-ui");

const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// instrument(io, {
//   auth: false,
// });

let users = [];

const addUser = (userLogin) => {
  const { userId } = userLogin;

  users.every((user) => user.userId !== userId) && users.push(userLogin);
};

const removeUser = (userId) => {
  users = users.filter((user) => user.userId !== userId);
};

const findUser = (value, key = "userId") => {
  return users.find((user) => {
    return user[key] === value;
  });
};

const findUsers = (callback) => {
  return users.filter((user) => callback(user));
};

const editData = (data, id, options) => {
  const newData = data.map((el) =>
    el.userId === id ? { ...el, ...options } : el
  );
  return newData;
};

const handleUserLogOut = (userDisconnect) => {
  if (userDisconnect) {
    if (userDisconnect.romCallId) {
      socket
        .to(roomCallId.toString())
        .emit("userCallOut", userDisconnect.userId);
    }

    const date = new Date();
    const time = date.getTime();

    try {
      const response = axios.put("/user/update-lastLogin", {
        userId: userDisconnect?.userId,
        lastLogin: time,
      });
    } catch (err) {
      console.log("err", { err });
    }

    const userReceivers = findUsers((user) =>
      userDisconnect?.friends?.includes(user?.userId)
    );

    if (userReceivers || userReceivers.length) {
      userReceivers.forEach((receiver) =>
        io.to(receiver.socketId).emit("friendLogout", {
          time,
          userDisconnectId: userDisconnect?.userId,
        })
      );
    }

    removeUser(userDisconnect.userId);
  }
};
io.on("connection", (socket) => {
  socket.on("userLogin", ({ userId, friends }) => {
    addUser({
      userId,
      socketId: socket.id,
      friends,
    });

    const userReceivers = findUsers((user) => friends.includes(user.userId));

    userReceivers.forEach((follower) => {
      io.to(follower.socketId).emit("friendOnline", userId);
    });

    io.emit(
      "getUsers",
      users.map((user) => user?.userId)
    );
  });

  //post

  socket.on(
    "likeHandler",
    ({ type, message, userPost, postId, userIdLike }) => {
      const receiver = findUser(userPost);

      if (receiver) {
        io.to(receiver.socketId).emit("updateLikePost", {
          message,
          postId,
          userIdLike,
          type,
        });
      }
    }
  );

  socket.on(
    "commentPostHandler",
    ({ type, comment, userPost, postId, message }) => {
      const receiver = findUser(userPost);

      if (receiver) {
        io.to(receiver.socketId).emit("updateCommentPost", {
          message,
          postId,
          type,
          comment,
        });
      }
    }
  );

  socket.on("postHandler", ({ type, post, userFollowings, message }) => {
    const userReceivers = findUsers((user) =>
      userFollowings.includes(user?.userId)
    );

    if (userReceivers.length) {
      userReceivers.forEach((user) =>
        io.to(user.socketId).emit("updateFeed", {
          post,
          type,
          message,
        })
      );
    }
  });

  socket.on("createPost", ({ dataEmit }) => {
    const datas = dataEmit.map((notification) => notification.receiverId);
    const userReceivers = findUsers((user) => datas.includes(user));

    if (userReceivers.length) {
      userReceivers.forEach((user) =>
        io.to(user.socketId).emit("updateNotification", {
          notification: dataEmit.find(
            (notification) => user.userId === notification.receiverId
          ),
        })
      );
    }
  });

  // notification

  socket.on("createNotification", ({ notification }) => {
    const receiver = findUser(notification?.receiverId);

    if (receiver) {
      io.to(receiver.socketId).emit("updateNotification", {
        notification,
      });
    }
  });

  // chat

  socket.on("typing", ({ receiverId, conversationId }) => {
    const receiver = findUser(receiverId);

    if (receiver) {
      io.to(receiver.socketId).emit("displayTyping", conversationId);
    }
  });

  //friend request

  socket.on("acceptFriendRequest", ({ friendId, userId, notification }) => {
    const receiver = findUser(friendId);

    users = users.map((user) =>
      user?.userId === userId
        ? {
            ...user,
            friends: user.friends.includes(friendId)
              ? user.friends
              : [friendId, ...user.friends],
          }
        : user?.userId === friendId
        ? {
            ...user,
            friends: user.friends.includes(userId)
              ? user.friends
              : [userId, ...user.friends],
          }
        : user
    );

    if (receiver) {
      io.to(receiver.socketId).emit("addListFriend", userId);
      io.to(receiver.socketId).emit("updateNotification", {
        notification,
      });
    }
  });

  socket.on("removeFriend", ({ friendId, userId }) => {
    const receiver = findUser(friendId);

    users = users.map((user) =>
      user?.userId === userId
        ? {
            ...user,
            friends: user.friends.filter((el) => el !== friendId),
          }
        : user?.userId === friendId
        ? {
            ...user,
            friends: user.friends.filter((el) => el !== userId),
          }
        : user
    );

    if (receiver) {
      io.to(receiver.socketId).emit("removeListFriend", userId);
    }
  });

  socket.on("changeFriendRequest", ({ friendId, friendRequest, status }) => {
    const receiver = findUser(friendId);

    if (receiver) {
      io.to(receiver.socketId).emit("updateStatus", {
        friendRequest,
        status,
      });
    }
  });

  //message

  socket.on("removeMessage", ({ receverId, newMessage, lastMessage }) => {
    const receiver = findUser(receverId);

    if (receiver) {
      io.to(receiver.socketId).emit("updateMessage", {
        newMessage,
        lastMessage,
      });
    }
  });

  socket.on("sendMessage", ({ newMessage, receiverId }) => {
    const receiver = findUser(receiverId);

    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", {
        receiverId,
        newMessage,
      });
    }
  });

  //call

  socket.on("createCall", (data) => {
    const { isCreate, isVideo, sender, receiverId, roomCallId } = data;

    if (isCreate) {
      users = editData(users, sender._id, {
        roomCallId,
      });
    }

    const receiver = findUser(receiverId);

    if (receiver) {
      if (receiver.roomCallId) {
        if (isCreate) {
          users = editData(users, sender._id, {
            roomCallId: "",
          });
        }
        socket.emit("userCallBusy", isCreate);
      } else {
        users = editData(users, receiverId, {
          roomCallId,
        });

        if (isCreate) {
          socket.join(roomCallId.toString());
        }
        io.to(receiver.socketId).emit("connectCall", {
          isVideo,
          userSendCall: sender,
          roomCallId,
          isCreate,
        });
      }
    } else {
      if (isCreate) {
        users = editData(users, sender._id, {
          roomCallId: "",
        });
      }
    }
  });

  socket.on("userCallNoReaction", (data) => {
    const { userCallId, userSendCallId } = data;

    users = editData(users, userCallId, { roomCallId: "" });
    users = editData(users, userSendCallId, { roomCallId: "" });
  });

  socket.on("joinRoomCall", async (data) => {
    const { userSendCall, userReceiveCall, roomCallId, peerId, isCreate } =
      data;

    const receiver = findUser(userSendCall);

    if (isCreate && !receiver) {
      return;
    }

    // if (isCreate) {
    //   try {
    //     //add room
    //     const response = await axios.put(`/conversation`, {
    //       roomCallId,
    //     });
    //   } catch (err) {
    //     users = editData(users, userReceiveCall, { roomCallId: "" });
    //     users = editData(users, userSendCall, { roomCallId: "" });

    //     const userReceivers = [userSendCall, userReceiveCall];
    //     userReceivers.forEach((userId) => {
    //       const user = findUser(userId);
    //       if (user) {
    //         io.to(user.socketId).emit("createRoomCallFail");
    //       }
    //     });

    //     return;
    //   }
    // }

    users = editData(users, userReceiveCall, { roomCallId });

    socket.join(roomCallId.toString());

    socket.to(roomCallId.toString()).emit("user-joined-call", peerId);
  });

  socket.on("userRefuseCall", (data) => {
    const { userRefuseId, receiverId, isCreate } = data;

    users = editData(users, userRefuseId, {
      roomCallId: "",
    });

    const receiver = findUser(receiverId);

    if (receiver) {
      if (isCreate) {
        users = editData(users, receiverId, {
          roomCallId: "",
        });
      }
      io.to(receiver.socketId).emit("callRefused");
    }
  });

  socket.on("refuseInviteCall", (userId) => {
    users = editData(users, userId, {
      roomCallId: "",
    });
  });

  socket.on("userOutCall", (data) => {
    const { userOutCallId, roomCallId } = data;

    socket.to(roomCallId.toString()).emit("userCallOut", userOutCallId);

    users = editData(users, userOutCallId, {
      roomCallId: "",
    });
  });

  //USER LOGOUT
  socket.on("disconnect", () => {
    const userDisconnect = users.find((user) => user.socketId === socket.id);

    handleUserLogOut(userDisconnect);
  });

  socket.on("userLogOut", (userLogOutId) => {
    const userDisconnect = users.find((user) => user.userId === userLogOutId);

    handleUserLogOut(userDisconnect);
  });
});

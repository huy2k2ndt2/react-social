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
let roomCalls = [];

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

const handleCheckRoomCall = async (user) => {
  if (user) {
    const { roomCallId, conversationId } = user;

    if (roomCallId) {
      const sizeRoom = io?.sockets?.adapter?.rooms?.get(
        roomCallId.toString()
      )?.size;

      if (sizeRoom === 1) {
        try {
          const roomCall = roomCalls.find((el) => (el.roomCallId = roomCallId));
          const notify = roomCall?.isVideo
            ? "Video chat has ended"
            : "Audio call ended";

          const responses = await Promise.all([
            axios.delete(
              `/room-chat?isAllow=true&roomCallId=${roomCallId}&conversationId=${conversationId}`
            ),
            axios.post("/message", {
              isNotify: true,
              conversationId,
              notify: [notify],
            }),
            axios.put("/conversation", {
              roomCallId: "",
              conversationId,
              isReset: true,
            }),
          ]);

          const { newMessage } = responses[1].data;

          const {
            newConversation: { members },
          } = responses[2].data;

          if (members) {
            members.forEach((memberId) => {
              const receiver = findUser(memberId);
              if (receiver) {
                io.to(receiver.socketId).emit("getMessage", {
                  receiverId: memberId,
                  newMessage,
                });
              }
            });
          }

          roomCalls = roomCalls.filter((el) => el.roomCallId !== roomCallId);
        } catch (err) {
          console.log("err", { err });
        }
      }
    }
  }
};

const handleUserLogOut = (userDisconnect, socket) => {
  if (userDisconnect) {
    if (userDisconnect.roomCallId) {
      const { roomCallId, userName, streamId } = userDisconnect;

      socket.to(roomCallId.toString()).emit("user-call-out", {
        userName: userName,
        streamId,
      });

      socket.leave(userDisconnect.roomCallId.toString());
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
  socket.on("userLogin", ({ userId, friends, userName }) => {
    addUser({
      userId,
      socketId: socket.id,
      friends,
      userName,
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

  socket.on("sendMessage", ({ newMessage, receivers }) => {
    console.log("users", users);

    receivers.forEach((receiverId) => {
      const receiver = findUser(receiverId);

      console.log("receiver", receiver);

      if (receiver) {
        io.to(receiver.socketId).emit("getMessage", {
          receiverId,
          newMessage,
        });
      }
    });
  });

  //call

  socket.on("createCall", (data) => {
    const {
      isCreate,
      isVideo,
      sender,
      receiverId,
      roomCallId,
      conversationId,
      streamId,
    } = data;

    if (isCreate) {
      users = editData(users, sender._id, {
        roomCallId,
        conversationId,
        streamId,
      });
    }

    const receiver = findUser(receiverId);

    if (receiver) {
      if (receiver.roomCallId) {
        if (isCreate) {
          users = editData(users, sender._id, {
            roomCallId: "",
            conversationId: "",
            streamId: "",
          });
        }
        socket.emit("userCallBusy", isCreate);
      } else {
        users = editData(users, receiverId, {
          roomCallId,
          conversationId,
        });

        if (isCreate) {
          socket.join(roomCallId.toString());
        }
        io.to(receiver.socketId).emit("connectCall", {
          isVideo,
          userSendCall: sender,
          roomCallId,
          isCreate,
          conversationId,
        });
      }
    } else {
      if (isCreate) {
        users = editData(users, sender._id, {
          roomCallId: "",
          conversationId: "",
          streamId: "",
        });
      }
    }
  });

  // Not join call

  socket.on("userRefuseCall", (data) => {
    const { userRefuseId, receiverId, isCreate } = data;

    users = editData(users, userRefuseId, {
      roomCallId: "",
      conversationId: "",
      streamId: "",
    });

    const receiver = findUser(receiverId);

    if (receiver) {
      if (isCreate) {
        users = editData(users, receiverId, {
          roomCallId: "",
          conversationId: "",
          streamId: "",
        });
      }
      io.to(receiver.socketId).emit("callRefused");
    }
  });

  socket.on("refuseInviteCall", (userId) => {
    users = editData(users, userId, {
      roomCallId: "",
      conversationId: "",
      streamId: "",
    });
  });

  socket.on("userCallNoReaction", async (data) => {
    const { userCallId, userSendCallId, isVideo, conversationId } = data;

    users = editData(users, userCallId, {
      roomCallId: "",
      conversationId: "",
      streamId: "",
    });
    users = editData(users, userSendCallId, {
      roomCallId: "",
      conversationId: "",
      streamId: "",
    });

    try {
      const message = `${isVideo ? "Video" : "Audio"} call`;

      const response = await axios.post("/message", {
        isNotify: true,
        senderId: userSendCallId,
        notify: [message, "Missed " + message],
        conversationId,
      });

      const { newMessage } = response.data;

      [userCallId, userSendCallId].forEach((userId) => {
        const receiver = findUser(userId);

        if (receiver) {
          io.to(receiver.socketId).emit("getMessage", {
            receiverId: userId,
            newMessage,
          });
        }
      });
    } catch (err) {
      console.log("err", { err });
    }
  });

  socket.on("joinRoomCall", async (data) => {
    const {
      userSendCall,
      userReceiveCall,
      roomCallId,
      peerId,
      isCreate,
      conversationId,
      isVideo,
      userJoinCallId,
      isNext,
      userName,
      streamId,
    } = data;

    if (!isNext) {
      const receiver = findUser(userSendCall);

      if (isCreate && !receiver) {
        return;
      }

      if (isCreate) {
        try {
          //create new room in db
          try {
            const responses = Promise.all([
              axios.post(`/room-chat`, {
                roomCallId,
                conversationId,
                userCreateId: userSendCall,
                isVideo,
              }),
              axios.put("/conversation", {
                roomCallId,
                conversationId,
              }),
            ]);
          } catch (err) {
            console.log("err", { err });
          }

          roomCalls.push({
            roomCallId,
            isVideo,
          });
        } catch (err) {
          users = editData(users, userReceiveCall, { roomCallId: "" });
          users = editData(users, userSendCall, { roomCallId: "" });

          const userReceivers = [userSendCall, userReceiveCall];
          userReceivers.forEach((userId) => {
            const user = findUser(userId);
            if (user) {
              io.to(user.socketId).emit("createRoomCallFail");
            }
          });

          return;
        }
      }
    }
    users = editData(users, userJoinCallId, {
      roomCallId,
      conversationId,
      streamId,
    });

    socket.join(roomCallId.toString());

    socket
      .to(roomCallId.toString())
      .emit("user-joined-call", { userName, peerId });
  });

  socket.on("end-call", (data) => {
    const { userOutCallId, streamId } = data;

    const userOutCall = findUser(userOutCallId);

    handleCheckRoomCall(userOutCall);

    if (userOutCall) {
      const { roomCallId, userName } = userOutCall;

      socket
        .to(roomCallId.toString())
        .emit("user-call-out", { userName, streamId });

      socket.leave(roomCallId.toString());

      users = editData(users, userOutCallId, {
        roomCallId: "",
        conversationId: "",
        streamId: "",
      });
    }
  });

  //user turn off camera
  socket.on("user-turn-off-video", (data) => {
    const { roomCallId, img, streamId } = data;

    socket.to(roomCallId.toString()).emit("update-user-camera", {
      img,
      streamId,
    });
  });

  //USER LOGOUT

  socket.on("disconnecting", () => {
    const userDisconnect = users.find((user) => user.socketId === socket.id);
    handleCheckRoomCall(userDisconnect);
    handleUserLogOut(userDisconnect, socket);

    socket.emit("get-stream");
  });

  socket.on("disconnect", () => {});

  socket.on("userLogOut", (userLogOutId) => {
    const userDisconnect = users.find((user) => user.userId === userLogOutId);
    handleCheckRoomCall(userDisconnect);

    handleUserLogOut(userDisconnect, socket);
  });
});

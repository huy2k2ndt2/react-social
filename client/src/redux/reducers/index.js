import authReducer from "./authReducer";
import chatReducer from "./chatReducer";
import friendRequestReducer from "./friendRequestReducer";
import messageReducer from "./messageReducer";
import networkReducer from "./networkReducer";
import notifycationReducer from "./notifycationReducer";
import profileReducer from "./profileReducer";
import callReducer from "./callReducer";
import peerReducer from "./peerReducer";
import createRoomChatReducer from "./createRoomChatReducer";

const rootReducer = (state = {}, action) => ({
  auth: authReducer(state.auth, action),
  chat: chatReducer(state.chat, action),
  friendRequest: friendRequestReducer(state.friendRequest, action),
  message: messageReducer(state.message, action),
  network: networkReducer(state.network, action),
  notification: notifycationReducer(state.notification, action),
  profile: profileReducer(state.profile, action),
  peer: peerReducer(state.peer, action),
  call: callReducer(state.call, action),
  createRoomChat: createRoomChatReducer(state.createRoomChat, action),
});

export default rootReducer;

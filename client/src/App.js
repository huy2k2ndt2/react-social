import { Routes, Route, useNavigate } from "react-router-dom";
import { Fragment, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";
import {
  ADD_FRIEND,
  ADD_USER_ONLINE,
  REMOVE_FRIEND,
  REMOVE_USER_OFFLINE,
  SET_CALL,
  SET_PEER,
  SET_SOCKET,
  SET_USERS_ONLINE,
} from "./redux/actions";
import { useDispatch, useSelector } from "react-redux";
import ModalCall from "./components/modalCall/ModalCall";

import { publicRoutes, privateRoutes } from "./routes";

function App() {
  const { firstConnect, socket, firstGetData, usersOnline } = useSelector(
    (state) => state.network
  );

  const { userCurrent } = useSelector((state) => state.auth);
  const { isCall, isInvited } = useSelector((state) => state.call);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    const handleConnectCall = (data) => {
      const { isVideo, userSendCall, roomCallId, isCreate } = data;

      dispatch({
        type: SET_CALL,
        payload: {
          isCall: true,
          isVideo,
          userSendCall,
          roomCallId,
          isCreate,
          isSenderCall: false,
        },
      });
    };

    socket.on("connectCall", handleConnectCall);

    return () => {
      socket?.off("handleConnectCall", handleConnectCall);
    };
  }, [socket]);

  useEffect(() => {
    const peer = new Peer(undefined, {
      host: "/",
      port: 9000,
      // path: "/",
    });

    dispatch({ type: SET_PEER, payload: peer });
  }, [dispatch]);

  useEffect(() => {
    const addUserOnline = (userLoginId) => {
      if (usersOnline.includes(userLoginId)) {
        return;
      }
      dispatch({
        type: ADD_USER_ONLINE,
        payload: userLoginId,
      });
    };

    const removeUserOffline = ({ userDisconnectId }) => {
      dispatch({
        type: REMOVE_USER_OFFLINE,
        payload: userDisconnectId,
      });
    };

    if (socket) {
      socket.on("friendOnline", addUserOnline);
      socket.on("friendLogout", removeUserOffline);
    }

    return () => {
      socket?.off("friendOnline", addUserOnline);
      socket?.off("friendLogout", removeUserOffline);
    };
  }, [socket]);

  useEffect(() => {
    const addListFriend = (userId) => {
      dispatch({
        type: ADD_FRIEND,
        payload: userId,
      });
    };

    const removeListFriend = (userId) => {
      dispatch({
        type: REMOVE_FRIEND,
        payload: userId,
      });
    };

    if (socket) {
      socket.on("addListFriend", addListFriend);
      socket.on("removeListFriend", removeListFriend);
    }

    return () => {
      socket?.off("addListFriend", addListFriend);
      socket?.off("removeListFriend", removeListFriend);
    };
  }, [socket]);

  useEffect(() => {
    if (firstConnect && userCurrent) {
      dispatch({
        type: SET_SOCKET,
        payload: io("ws://localhost:8900"),
      });
    }
  }, [userCurrent]);

  useEffect(() => {
    const handleSetUserOnline = (allUser) => {
      if (!firstGetData) return;
      const usersFollowOnline = userCurrent?.followings.filter((followingiD) =>
        allUser.find((userId) => userId === followingiD)
      );

      dispatch({
        type: SET_USERS_ONLINE,
        payload: usersFollowOnline,
      });
    };

    if (socket) {
      socket.emit("userLogin", {
        userId: userCurrent?._id,
        friends: userCurrent?.friends,
      });
      socket.on("getUsers", handleSetUserOnline);
    }

    return () => {
      socket?.off("getUsers", handleSetUserOnline);
    };
  }, [socket, firstGetData]);

  return (
    <>
      <Routes>
        {publicRoutes.map((route) => {
          const Layout = route.layout ? route.layout : Fragment;

          const Page = route.component;

          return (
            <Route
              key={route.key}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}

        {privateRoutes.map((route) => {
          const Layout = route.layout ? route.layout : Fragment;

          const Page = route.component;

          return (
            <Route
              key={route.key}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
      </Routes>

      {isCall && <ModalCall />}

      {/* <ModalCall /> */}
    </>
  );
}

export default App;

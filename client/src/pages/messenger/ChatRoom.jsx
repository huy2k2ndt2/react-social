import { getDataAPI, postDataAPI } from "../../api/fetchData";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Typing from "./Typing";
import DisplayMessage from "./DisplayMessage";
import CreateMessage from "./CreateMessage";
import Call from "./Call";

import {
  SET_FILES,
  UPDATE_FRIEND_CHAT,
  UPDATE_LAST_MESSAGE,
} from "../../redux/actions";

import Avatar from "../../components/avatar/Avatar";
import useCheckOnline from "../../hooks/useCheckOnline";
import useFormatTime from "../../hooks/useFormatTime";

import { imageUpload } from "../../helpers/image";
import { addElment } from "../../helpers";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [hasTyping, setHasTyping] = useState(false);

  const { conversationChat, friendChat } = useSelector((state) => state.chat);

  const [isOnline, setIsOnline] = useCheckOnline(friendChat);

  const { socket } = useSelector((state) => state.network);

  const { userCurrent } = useSelector((state) => state.auth);
  const { files } = useSelector((state) => state.message);

  const dispatch = useDispatch();
  const time = useFormatTime(friendChat);

  useEffect(() => {
    let isMount = true;

    if (!socket) return;

    const handleSetTyping = (conversationId) => {
      if (conversationChat?._id !== conversationId) return;
      if (isMount) setHasTyping(true);
    };

    const updateListMessage = ({ newMessage, lastMessage }) => {
      if (lastMessage) {
        dispatch({
          type: UPDATE_LAST_MESSAGE,
          payload: lastMessage,
        });
      }

      if (newMessage?.conversationId === conversationChat?._id) {
        setMessages((prev) =>
          prev.map((message) =>
            message?._id === newMessage?._id ? newMessage : message
          )
        );
      }
    };

    const updateFriendConversation = ({ userDisconnectId, time }) => {
      if (friendChat?._id === userDisconnectId) {
        dispatch({
          type: UPDATE_FRIEND_CHAT,
          payload: time,
        });
      }
    };

    socket.on("displayTyping", handleSetTyping);
    socket.on("updateMessage", updateListMessage);
    socket.on("friendLogout", updateFriendConversation);

    return () => {
      isMount = false;
      socket?.off("displayTyping", handleSetTyping);
      socket?.off("updateMessage", updateListMessage);
      socket?.off("friendLogout", updateFriendConversation);
    };
  }, [socket]);

  useEffect(() => {
    let isMount = true;

    const getMessages = async () => {
      if (conversationChat?._id) {
        try {
          const response = await getDataAPI(`/message/${conversationChat._id}`);
          const { message, messages } = response;

          // toast.success(message, { autoClose: 2000 });
          if (isMount) {
            setMessages(messages);
          }
        } catch (err) {
          console.log("err", err);
        }
      }
    };

    if (conversationChat) getMessages();

    return () => (isMount = false);
  }, [conversationChat]);

  useEffect(() => {
    const handleReceiveMessage = ({ newMessage, receiverId }) => {
      const { conversationId, text, senderId } = newMessage;


      dispatch({
        type: UPDATE_LAST_MESSAGE,
        payload: newMessage,
      });

      if (!conversationChat) return;

      if (conversationId === conversationChat._id) {
        updateConversation({
          receiverId,
          conversationId,
          isRead: true,
        });

        // setArrivalMessage(newMessage);

        setMessages(
          (prev) =>
            addElment(prev, newMessage, (array, newMessage) =>
              array.find((el) => el?._id === newMessage?._id)
            ),
          false
        );

        setHasTyping(false);
      }
    };

    socket?.on("getMessage", handleReceiveMessage);

    return () => {
      socket?.off("getMessage", handleReceiveMessage);
    };
  }, [socket, conversationChat]);

  const updateConversation = async ({
    receiverId,
    conversationId,
    isRead,
    lastMessage,
  }) => {
    try {
      const response = await postDataAPI(`/conversation/update-conversation`, {
        receiverId,
        conversationId,
        isRead,
        lastMessage,
      });

      const { message } = response;

      // toast.success(message, { autoClose: 2000 });
    } catch (err) {
      console.log("err", err);
    }
  };

  const createNewMessage = async (text) => {
    if (!text && !files.length) return;
    try {
      const receiverId = conversationChat.members.find(
        (memberId) => memberId !== userCurrent._id
      );

      const messageCreate = {
        conversationId: conversationChat?._id,
        senderId: userCurrent?._id,
        // text,
        // receiverId,
      };

      if (text) messageCreate.text = text;

      const images = await imageUpload(files);
      messageCreate.images = [...images];

      const response = await postDataAPI(`/message`, messageCreate);
      const { message, newMessage } = response;

      updateConversation({
        receiverId,
        conversationId: conversationChat?._id,
        isRead: false,
        lastMessage: [
          userCurrent?._id,
          text ? text : ` sent ${files.length} photos`,
        ],
      });

      dispatch({
        type: UPDATE_LAST_MESSAGE,
        payload: newMessage,
      });

      dispatch({
        type: SET_FILES,
        payload: [],
      });

      socket?.emit("sendMessage", {
        receiverId,
        newMessage,
      });

      // toast.success(message, { autoClose: 2000 });

      setMessages((prev) => [...prev, newMessage]);
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <>
      <div className="contact bar">
        {conversationChat && (
          <>
            <div className="pic">
              <Avatar
                user={friendChat}
                width="64px"
                height="64px"
                link={false}
              />
            </div>
            <div className="contact-info">
              <div className="name">{friendChat?.userName}</div>
              <div className="seen">
                {userCurrent?.friends.includes(friendChat?._id)
                  ? isOnline
                    ? "Active"
                    : "Active " + time + " ago"
                  : ""}
              </div>
            </div>
            <Call />
          </>
        )}
      </div>
      <div className="messages" id="chat">
        {conversationChat ? (
          <div className="messagesContainer">
            <DisplayMessage
              updateConversation={updateConversation}
              setMessages={setMessages}
              messages={messages}
            />
            {hasTyping && <Typing />}
          </div>
        ) : (
          <div className="noMes">Chon ban de chat</div>
        )}
      </div>
      <CreateMessage createNewMessage={createNewMessage} />
    </>
  );
};

export default ChatRoom;

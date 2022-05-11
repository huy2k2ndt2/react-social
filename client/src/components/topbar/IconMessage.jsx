import { Chat } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Messenger from "../../pages/messenger/Messenger";
import {
  INCREASE_NUMBER_UNREAD,
  SET_CHAT,
  SET_NUMBER_UNREAD,
} from "../../redux/actions";

const IconMessage = () => {
  const [number, setNumber] = useState(0);

  const { isChat, conversationUnReads } = useSelector((state) => state.chat);

  const { socket } = useSelector((state) => state.network);
  const { conversationChat } = useSelector((state) => state.chat);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!conversationUnReads) return;

    setNumber(conversationUnReads.length);
  }, [conversationUnReads]);

  useEffect(() => {
    const updateNumberConversationUnRead = ({ newMessage }) => {
      const { conversationId } = newMessage;

      if (!conversationChat || conversationChat?._id !== conversationId) {
        if (!conversationUnReads.includes(conversationId)) {
          dispatch({
            type: INCREASE_NUMBER_UNREAD,
          });
        }
      }
    };

    socket?.on("getMessage", updateNumberConversationUnRead);

    return () => {
      socket?.off("getMessage", updateNumberConversationUnRead);
    };
  }, [socket, conversationUnReads , conversationChat]);

  const toogleMessage = () => {
    const data = {
      isChat: !isChat,
    };

    if (isChat) {
      data.conversationChat = null;
    }

    dispatch({
      type: SET_CHAT,
      payload: data,
    });
  };

  return (
    <>
      <Chat onClick={toogleMessage} />
      <span className="topbarIconBadge">{number}</span>

      {isChat && <Messenger />}
    </>
  );
};

export default IconMessage;

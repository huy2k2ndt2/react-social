import { Chat } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Messenger from "../../pages/messenger/Messenger";
import {
  SET_CHAT,
  SET_NUMBER_UNREAD,
  UPDATE_STATUS_CONVERSATION,
} from "../../redux/actions";

const IconMessage = () => {
  const { number, isChat, statusConversations, conversationChat } = useSelector(
    (state) => state.chat
  );

  const { socket } = useSelector((state) => state.network);

  const dispatch = useDispatch();

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

  useEffect(() => {
    if (!statusConversations) return;
    const number =
      statusConversations?.reduce(
        (previousValue, conversation) =>
          conversation.isRead ? previousValue : previousValue + 1,
        0
      ) || 0;

    dispatch({
      type: SET_NUMBER_UNREAD,
      payload: number,
    });
  }, [statusConversations]);
  useEffect(() => {
    const updateStatusConversation = ({ newMessage }) => {
      const { conversationId } = newMessage;

      if (!conversationChat || conversationId !== conversationChat._id) {
        dispatch({
          type: UPDATE_STATUS_CONVERSATION,
          payload: {
            conversationId,
            isRead: false,
          },
        });
      }
    };

    socket?.on("getMessage", updateStatusConversation);

    return () => {
      socket?.off("getMessage", updateStatusConversation);
    };
  }, [socket, conversationChat]);

  return (
    <>
      <Chat onClick={toogleMessage} />
      <span className="topbarIconBadge">{number}</span>

      {isChat && <Messenger />}
    </>
  );
};

export default IconMessage;

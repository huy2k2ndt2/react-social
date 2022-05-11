import React, { useEffect, useState } from "react";
import {
  ADD_CONVERSATION,
  ADD_CONVERSATION_ACCEPTS,
  ADD_STATUS_CONVERSATION,
  SET_CHAT,
  SET_CONVERSATION_CHAT,
  SET_NEW_CONVERSATION_CHAT,
} from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { getDataAPI } from "../../api/fetchData";

const ButtonMessage = () => {
  const [isClick, setIsClick] = useState(false);

  const { userProfile, isFriend } = useSelector((state) => state.profile);

  const { listConversation, isChat, conversationChat } = useSelector(
    (state) => state.chat
  );

  useEffect(() => {
    if (isClick && isChat && listConversation) {
      handleSetConversationChat();
    }
  }, [isChat, listConversation, isClick]);

  const handleSetConversationChat = async () => {
    if (!userProfile) return;
    try {
      const response = await getDataAPI(
        `conversation?receiverId=${userProfile?._id}&isFriend=${
          isFriend ? true : false
        }`
      );

      const { message, conversation } = response;

      if (conversation?._id === conversationChat?._id) return;

      if (!listConversation?.find((item) => item?._id === conversation?._id)) {
        dispatch({
          type: ADD_CONVERSATION,
          payload: { conversation },
        });
      }

      dispatch({
        type: SET_NEW_CONVERSATION_CHAT,
        payload: { conversationChat: conversation },
      });
    } catch (err) {
      console.log("err", err);
    }
  };

  const dispatch = useDispatch();

  return (
    <button
      className="card__action__button card__action--message"
      onClick={() => {
        setIsClick(true);
        dispatch({
          type: SET_CHAT,
          payload: {
            isChat: true,
          },
        });
      }}
    >
      message
    </button>
  );
};

export default ButtonMessage;

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DISPLAY_CONVERSATION_PENDING } from "../../redux/actions";
import "./optionsMessage.scss";

const OptionsMessage = () => {
  const dispatch = useDispatch();

  const { conversationPendings } = useSelector((state) => state.chat);

  const displayConversationPending = () => {
    dispatch({
      type: DISPLAY_CONVERSATION_PENDING,
    });
  };

  return (
    <h2 className="options-message" onClick={displayConversationPending}>
      <div className="number">
        <i className="fa-solid fa-message"></i>
        <span>{conversationPendings?.length || 0}</span>
      </div>
      Message waiting
    </h2>
  );
};

export default OptionsMessage;

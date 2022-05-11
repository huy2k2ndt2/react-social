import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DISPLAY_CONVERSATION_PENDING, SET_IS_SHOW } from "../../redux/actions";
import "./optionsMessage.scss";

const OptionsMessage = () => {
  const [number, setNumber] = useState(0);

  const { listConversation } = useSelector((state) => state.chat);
  const { userCurrent } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!listConversation || !userCurrent) return;

    const { _id } = userCurrent;

    const numberSet = listConversation.reduce((prevState, conversation) => {
      const {status} = conversation;
      return status.includes(_id) ? prevState : prevState + 1;
    }, 0);

    setNumber(numberSet);
  }, [listConversation, userCurrent]);

  const displayConversationPending = () => {
    dispatch({
      type: SET_IS_SHOW,
      payload: true,
    });
  };

  return (
    <h2 className="options-message" onClick={displayConversationPending}>
      <div className="number">
        <i className="fa-solid fa-message"></i>
        <span>{number}</span>
      </div>
      Message waiting
    </h2>
  );
};

export default OptionsMessage;

import React from "react";
import { useSelector } from "react-redux";

const DisplayMessageContent = ({ message }) => {
  const { userCurrent } = useSelector((state) => state.auth);

  return (
    <>
      {message?.isNotify ? (
        message?.senderId ? (
          <div
            className={`message ${
              message.senderId === userCurrent?._id ? "user" : "friend"
            }`}
          >
            {message.senderId === userCurrent?._id
              ? message?.notify[0]
              : message?.notify[1]}
          </div>
        ) : (
          <div className={`message notify`}>{message.notify[0]}</div>
        )
      ) : (
        message?.text && (
          <div
            className={`message ${
              message.senderId === userCurrent?._id ? "user" : "friend"
            }`}
          >
            {message.text}
          </div>
        )
      )}
    </>
  );
};

export default DisplayMessageContent;

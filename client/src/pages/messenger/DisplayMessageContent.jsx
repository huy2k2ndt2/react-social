import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DisplayMessageContent = ({ message }) => {
  const [user, setUser] = useState();

  const {
    conversationChat: { listMembers },
  } = useSelector((state) => state.chat);
  const { userCurrent } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!message || !listMembers) return;

    let userSend;
    if (message.senderId === userCurrent?._id) userSend = { ...userCurrent };
    else {
      userSend = listMembers.find((member) => member?._id === message.senderId);
    }

    setUser({
      profilePicture: userSend.profilePicture,
      userName: userSend.userName,
    });
  }, [message, listMembers, userCurrent]);

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

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { deleteDataAPI } from "../../api/fetchData";
import { UPDATE_LAST_MESSAGE } from "../../redux/actions";
import DisplayMessageContent from "./DisplayMessageContent";

const DisplayMessage = ({ updateConversation, messages, setMessages }) => {
  const { userCurrent } = useSelector((state) => state.auth);
  const { conversationChat } = useSelector((state) => state.chat);

  const { socket } = useSelector((state) => state.network);

  const dispatch = useDispatch();

  const messageRef = useRef();

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messages]);

  const removeMessage = async (message) => {
    const lastMessage = messages[messages.length - 1];

    try {
      const response = await deleteDataAPI(`/message/${message?._id}`);

      let newLastMessage = null;

      if (lastMessage?._id === message?._id) {
        newLastMessage = {
          conversationId: message.conversationId,
          senderId: userCurrent?._id,
          message: " has withdrawn the message",
        };

        updateConversation({
          conversationId: message?.conversationId,
          lastMessage: [userCurrent?._id, " has withdrawn the message"],
        });

        dispatch({
          type: UPDATE_LAST_MESSAGE,
          payload: newLastMessage,
        });
      }

      const { newMessage } = response;

      // toast.success(message, { autoClose: 2000 });

      setMessages((prev) =>
        prev.map((item) => (item._id == newMessage?._id ? newMessage : item))
      );

      socket.emit("removeMessage", {
        newMessage,
        receverId: conversationChat.members.find(
          (memberId) => memberId !== userCurrent?._id
        ),
        lastMessage: newLastMessage,
      });
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <>
      {messages.map((message) => (
        <div className={`messageContent`} key={message?._id} ref={messageRef}>
          <DisplayMessageContent message={message} />

          {!message?.notify && (
            <div
              className={`imgsContainer ${!message?.text && "add-space"} ${
                message.senderId === userCurrent?._id ? "user" : "friend"
              }`}
            >
              <div className={`imgs `}>
                {message.images.map((img) => (
                  <div className="img" key={img.public_id}>
                    <img src={img.url} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            className={`time ${
              (message?.notify && "notify") ||
              (message.senderId === userCurrent?._id && "user")
            }`}
          >
            {moment(message?.createdAt).format("HH:mm")}
          </div>

          {!message.isDeleted && message.senderId === userCurrent?._id && (
            <span className="CrudMessage">
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAFBJREFUSEtjZKAxYKSx+Qwjy4L/aMFJlO+JUgQ1eNQC2iRYUuKALBeQYsFoJBMMYpoHEUEXYFNASiTT3AKaB9GoBWTFIUFNgyoVEXTtgOQDAEM9DBleh0KcAAAAAElFTkSuQmCC" />

              <div className="buttonActions">
                <button type={"button"} onClick={() => removeMessage(message)}>
                  Remove
                </button>
              </div>
            </span>
          )}
        </div>
      ))}
    </>
  );
};

export default DisplayMessage;

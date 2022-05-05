import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { SET_FILES } from "../../redux/actions";
import DisplayImageMessage from "./DisplayImageMessage";

const CreateMessage = ({ createNewMessage }) => {
  const [isTyping, setIsTyping] = useState(false);

  const messageRef = useRef();

  const { files } = useSelector((state) => state.message);
  const { conversationChat } = useSelector((state) => state.chat);

  const { socket } = useSelector((state) => state.network);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isTyping) return;

    socket?.emit("typing", {
      receiverId: conversationChat?.friend?._id,
      conversationId: conversationChat?._id,
    });
  }, [isTyping]);

  const handleSubmit = () => {
    createNewMessage(messageRef.current.value);
    messageRef.current.value = "";
    messageRef.current.focus();
  };

  return (
    <form
      className={`input ${!conversationChat && "disable"} ${
        files.length && "files"
      }`}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <label htmlFor={conversationChat?._id} className="icon-camera">
        <i className="fas fa-camera"></i>
      </label>
      <input
        style={{ display: " none" }}
        type={"file"}
        id={conversationChat?._id}
        accept=".png,.jpeg,.jpg"
        multiple
        onChange={(e) => {
          const data = Array.from(e.target.files);

          dispatch({
            type: SET_FILES,
            payload: [
              ...data.map((file) => {
                file.uuid = uuidv4();
                return file;
              }),
              ...files,
            ],
          });
        }}
      />

      <i className="far fa-laugh-beam"></i>

      <div className="inputContainer">
        <DisplayImageMessage />
        <div className="inputCreate">
          <input
            ref={messageRef}
            placeholder="Aa"
            type="text"
            onChange={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
          />
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAARpJREFUSEu9lIERwUAQRX8qoBNUQgeUoAQqQAd0QAdUgA7ogA7MyyyTObncJhE7kzFD/Hd/999m6riyjvX1d8BFUk/SQtLuF+5CBw8DoH2TtJW0kcT3jSoE7CWNAyXE101BIWAuaRU5KiAOsDR3LkchYCjp7PgnrXOBylJUnEOKhSNmdIy9WAbAxcweEuUpADj6AqXuwcRA4eBjUGJOID4RTwHeQv2Cq4HDEqAR79UBTA1CC1N1lZS/lwLQIoT59BTCtIiU5RUb8vu0tMZTJ1svriHXienBTuyOqfeikRIWIvuqsuqsiqetCpdwbAZlyw5hBsdTe6tWreu7paGRcMwBF4Tk0IZP1FJ9rvo9dQ/aaEfvQWvRokDnDl64CTgZWvgaSwAAAABJRU5ErkJggg=="
            onClick={handleSubmit}
          />
        </div>
      </div>
      <i className="fas fa-microphone"></i>
    </form>
  );
};

export default CreateMessage;

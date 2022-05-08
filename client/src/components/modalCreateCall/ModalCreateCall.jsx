import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  END_CALL,
  SET_IS_ANSWER,
  SET_USER_STREAM,
  SET_USER_STREAMs,
} from "../../redux/actions";
import Avatar from "../avatar/Avatar";
import { addVideoStream, openStream } from "../../helpers/media";

const ModalCreateCall = () => {
  const { socket } = useSelector((state) => state.network);

  const {
    isVideo,
    userSendCall,
    isSenderCall,
    isAnswer,
    roomCallId,
    conversationId,
  } = useSelector((state) => state.call);
  const peer = useSelector((state) => state.peer);
  const { userCurrent } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const refuseCall = () => {
    socket.emit("userRefuseCall", {
      userRefuseId: userCurrent?._id,
      receiverId: userSendCall?._id,
      isCreate: true,
    });

    dispatch({
      type: END_CALL,
    });
  };

  const handleAnswer = async () => {
    dispatch({
      type: SET_IS_ANSWER,
      payload: true,
    });

    let stream;
    try {
      stream = await openStream(isVideo);

      dispatch({
        type: SET_USER_STREAM,
        payload: stream,
      });
      addVideoStream(stream, true);
      if (!socket) return;

      socket.emit("joinRoomCall", {
        userSendCall: userSendCall?._id,
        userReceiveCall: userCurrent?._id,
        roomCallId,
        peerId: peer._id,
        isCreate: true,
        conversationId,
        isVideo,
        userName: userCurrent?.userName,
        streamId: stream.id,
      });
    } catch (err) {
      console.log("err", { err });
    }
  };

  return (
    <div className="call_box">
      <div className="text-center call_info" style={{ padding: "40px 0" }}>
        <Avatar
          width="150px"
          height="150px"
          user={userSendCall}
          link={false}
          isStatus={false}
        />
        <h4>{userSendCall?.userName}</h4>
      </div>

      {!isAnswer && (
        <div>
          {isVideo ? (
            <span>calling video...</span>
          ) : (
            <span>calling audio...</span>
          )}

          {/* <div className="timer">
            <small>{mins.toString().length < 2 ? "0" + mins : mins}</small>
            <small>:</small>
            <small>
              {second.toString().length < 2 ? "0" + second : second}
            </small>
          </div> */}
        </div>
      )}

      <div className="call_menu">
        <i
          className="fa-solid fa-phone-slash text-danger"
          onClick={refuseCall}
        ></i>

        {!isSenderCall && !isAnswer && (
          <i className="fa-solid fa-phone-flip" onClick={handleAnswer}></i>
        )}
      </div>
    </div>
  );
};

export default ModalCreateCall;

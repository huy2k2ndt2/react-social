import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./modalInviteCall.scss";
import Avatar from "../avatar/Avatar";
import {
  REFUSE_INVITE,
  SET_IS_ANSWER,
  SET_USER_STREAM,
} from "../../redux/actions";

import { addVideoStream, openStream } from "../../helpers/media";

const ModalInviteCall = () => {
  const { userSendCall } = useSelector((state) => state.call);
  const [countTime, setCountTime] = useState(20);

  const { userCurrent } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.network);
  const peer = useSelector((state) => state.peer);
  const {
    isAnswer,
    roomCallId,
    isVideo,
    isCreate,
    userStream,
    conversationId,
  } = useSelector((state) => state.call);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isAnswer) return;
    if (!countTime) {
      return handleRefuseInvite();
    }

    const handleCountTime = () => setCountTime((prev) => prev - 1);

    const timer = setTimeout(handleCountTime, 1000);

    return () => clearTimeout(timer, handleCountTime);
  }, [countTime, isAnswer]);

  const handleJoinCall = async () => {
    dispatch({
      type: SET_IS_ANSWER,
      payload: true,
    });

    const stream = await openStream(isVideo);
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
      isCreate: false,
      conversationId,
      userName: userCurrent?.userName,
      streamId: stream.id,
    });
  };

  const handleRefuseInvite = () => {
    dispatch({
      type: REFUSE_INVITE,
    });

    socket?.emit("refuseInviteCall", userCurrent?._id);
  };

  return (
    <div className="modalInvite_content">
      <span className="close" onClick={handleRefuseInvite}>
        ×
      </span>
      <div className="info">
        <Avatar user={userSendCall} link={false} isStatus={false} />
        <div className="noMes">
          {`${userSendCall?.userName} Invited you to join the call`}
        </div>
      </div>
      <div className="buttons">
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleRefuseInvite}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleJoinCall}
        >
          {`Join ${countTime}`}
        </button>
      </div>
    </div>
  );
};

export default ModalInviteCall;

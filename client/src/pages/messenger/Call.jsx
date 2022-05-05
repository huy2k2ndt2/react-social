import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_CALL } from "../../redux/actions";
import ModalCall from "../../components/modalCall/ModalCall";
import { v4 as uuidv4 } from "uuid";

const Call = () => {
  const dispatch = useDispatch();

  const { friendChat } = useSelector((state) => state.chat);
  const { socket } = useSelector((state) => state.network);
  const { userCurrent } = useSelector((state) => state.auth);
  const { isCall, isVideo, userReciverCall, roomCallId } = useSelector(
    (state) => state.call
  );
  const { _id } = useSelector((state) => state.peer);

  const call = (isVideo) => {
    dispatch({
      type: SET_CALL,
      payload: {
        isVideo,
        userSenderCall: null,
        userReciverCall: friendChat,
        isSenderCall: true,
        roomCallId: uuidv4(),
        isCall: true,
        isCreate: true,
      },
    });
  };

  useEffect(() => {
    if (!socket || !userCurrent || !isCall) return;
    socket?.emit("createCall", {
      isVideo,
      sender: {
        profilePicture: userCurrent.profilePicture,
        userName: userCurrent.userName,
        _id: userCurrent._id,
      },
      receiverId: userReciverCall?._id,
      roomCallId,
      isCreate: true,
    });
  }, [socket, userCurrent, isCall]);

  return (
    <>
      <div className="icon-call">
        <i className="fa-solid fa-phone" onClick={() => call(false)}></i>
        <i className="fa-solid fa-video" onClick={() => call(true)}></i>
      </div>
    </>
  );
};

export default Call;

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_CALL, SET_USER_STREAM } from "../../redux/actions";
import ModalCall from "../../components/modalCall/ModalCall";
import { v4 as uuidv4 } from "uuid";
import { getDataAPI } from "../../api/fetchData";
import { addVideoStream, openStream } from "../../helpers/media";

const Call = () => {
  const dispatch = useDispatch();

  const { friendChat } = useSelector((state) => state.chat);
  const {
    conversationChat: { _id },
  } = useSelector((state) => state.chat);
  const { socket } = useSelector((state) => state.network);
  const peer = useSelector((state) => state.peer);
  const { userCurrent } = useSelector((state) => state.auth);
  const {
    userStream,
    isCall,
    isVideo,
    userReciverCall,
    roomCallId,
    isAnswer,
    conversationId,
  } = useSelector((state) => state.call);

  const call = async (isVideo) => {
    try {
      const response = await getDataAPI(`/room-chat?conversationId=${_id}`);

      const { roomCall } = response;

      const stream = await openStream(isVideo);
      dispatch({
        type: SET_USER_STREAM,
        payload: stream,
      });

      if (roomCall) {
        const { conversationId, isVideo, roomCallId } = roomCall;

        dispatch({
          type: SET_CALL,
          payload: {
            isVideo,
            isAnswer: true,
            isCall: true,
            isCreate: false,
            conversationId: conversationId,
          },
        });

        addVideoStream(stream, true);

        if (!socket) return;

        socket.emit("joinRoomCall", {
          roomCallId,
          peerId: peer._id,
          isCreate: false,
          conversationId,
          isVideo,
          isNext: true,
          userJoinCallId: userCurrent?._id,
          userName: userCurrent?.userName,
          streamId: stream.id,
        });
      } else {

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
            conversationId: _id,
          },
        });
      }
    } catch (err) {
      console.log("err", { err });
    }
  };

  useEffect(() => {
    if (!socket || !userCurrent || !isCall || !userStream) return;
    if (!isAnswer) {
      socket?.emit("createCall", {
        isVideo,
        sender: {
          profilePicture: userCurrent.profilePicture,
          userName: userCurrent.userName,
          _id: userCurrent?._id,
        },
        conversationId,
        receiverId: userReciverCall?._id,
        roomCallId,
        isCreate: true,
        streamId: userStream.id,
      });
    }
  }, [socket, userCurrent, isCall, userStream, isAnswer]);

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

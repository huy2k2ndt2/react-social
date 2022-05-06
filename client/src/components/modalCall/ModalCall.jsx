import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { STORE_IMG } from "../../contants/imgContant";
import { END_CALL, SET_IS_ANSWER, SET_USER_STREAM } from "../../redux/actions";

import "./modalCall.scss";
import NavModalCall from "./NavModalCall";
import InviteFriend from "./InviteFriend";
import ModalInviteCall from "../modalInviteCall/ModalInviteCall";
import ModalCreateCall from "../modalCreateCall/ModalCreateCall";
import { addVideoStream, openStream } from "../../helpers/media";

const CallModal = () => {
  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);
  const [second, setSecond] = useState(0);
  const [total, setTotal] = useState(0);

  const [isMic, setIsMic] = useState(true);
  const [isOpenVideo, setOpenVideo] = useState(true);

  const {
    isVideo,
    userReciverCall,
    isAnswer,
    isCreate,
    roomCallId,
    isSenderCall,
    userStream,
  } = useSelector((state) => state.call);

  const { socket } = useSelector((state) => state.network);
  const peer = useSelector((state) => state.peer);
  const { userCurrent } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  // Set Time

  useEffect(() => {
    setSecond(total % 60);
    setMins(parseInt(total / 60));
    setHours(parseInt(total / 3600));
  }, [total]);

  useEffect(() => {
    const getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: isVideo, audio: false }, (stream) => {
      dispatch({
        type: SET_USER_STREAM,
        payload: stream,
      });
    });
  }, [isVideo]);

  useEffect(() => {
    if (!peer || !userStream) return;

    peer.on("call", (call) => {
      call.answer(userStream);
      call.on("stream", function (remoteStream) {
        addVideoStream(remoteStream);
      });
    });

    return () => peer.removeListener("call");
  }, [userStream, peer]);

  useEffect(() => {
    const timerId = setInterval(() => setTotal((prev) => prev + 1), 1000);

    return () => {
      setTotal(0);
      clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    const handleSendStream = (peerId) => {
      const call = peer.call(peerId, userStream);

      if (!isAnswer) {
        dispatch({
          type: SET_IS_ANSWER,
          payload: true,
        });

        addVideoStream(userStream , true);
      }

      if (!call) return;

      call.on("stream", (remoteStream) => {
        addVideoStream(remoteStream);
      });
    };

    socket.on("user-joined-call", handleSendStream);

    return () => socket?.off("user-joined-call", handleSendStream);
  }, [socket, userStream, isAnswer]);

  useEffect(() => {
    if (!socket) return;

    const handleUserCallOut = () => {
      toast.info(`${userReciverCall?.userName} got off the call`, {
        autoClose: 2000,
      });
    };

    const handleNotify = (message, isClose) => {
      toast.info(message, {
        autoClose: 500,
      });

      if (isClose) {
        dispatch({
          type: END_CALL,
        });
      }
    };

    socket.on("callRefused", () => {
      handleNotify(`${userReciverCall?.userName} refuse the call`);
    });

    socket.on("userCallOut", handleUserCallOut);
    socket.on("userCallBusy", (isClose) => {
      handleNotify(`${userReciverCall.userName} is on another call!`, isClose);
    });

    return () => {
      socket?.off("userCallOut", handleUserCallOut);
      socket?.off("userCallBusy");
      socket?.off("callRefused");
    };
  }, [socket, userReciverCall]);

  useEffect(() => {
    if (isAnswer) {
      setTotal(0);
    } else {
      const timerId = setTimeout(() => {
        if (isSenderCall) {
          socket?.emit("userCallNoReaction", {
            userCallId: userReciverCall._id,
            userSendCallId: userCurrent._id,
          });
        }

        dispatch({
          type: END_CALL,
        });
      }, 10000);

      return () => clearTimeout(timerId);
    }
  }, [isAnswer]);

  const endCall = () => {
    // tracks &&
    //   tracks.forEach((track) => {
    //     track.stop();
    //   });

    dispatch({
      type: END_CALL,
    });
    if (isAnswer) {
      dispatch({
        type: SET_IS_ANSWER,
        payload: false,
      });
    }
    socket?.emit("userOutCall", {
      userOutCallId: userCurrent?._id,
      roomCallId,
    });
  };

  const hanldeToogleMic = () => {
    setIsMic((prev) => !prev);
    socket?.emit("userCallSettingMic", {
      isMic: !isMic,
    });
  };

  const toogleStream = (type) => {
    if (!userStream) return;

    const track = userStream.getTracks().find((track) => track.kind === type);

    if (!track) return;

    if (track.enabled) {
      track.enabled = false;
    } else {
      track.enabled = true;
    }
  };

  return (
    <div className="call_modal">
      <div
        className="modal_container"
        style={{
          display: isAnswer ? "none" : "flex",
        }}
      >
        {!isAnswer && isCreate ? <ModalCreateCall /> : <ModalInviteCall />}
      </div>
      <div
        className="header"
        style={{
          display: `${isAnswer ? "block" : "none"}`,
        }}
      >
        <NavModalCall />

        <div className="container">
          <div className="top-icons">
            <img src={STORE_IMG + "search.png"} alt="" />
            <img src={STORE_IMG + "menu.png"} alt="" />
          </div>
          <div className="video_layout">
            <div className="content_left">
              <div className="pin_video border_center"></div>
              <div className="time_video">
                <span>{hours.toString().length < 2 ? "0" + hours : hours}</span>
                <span>:</span>
                <span>{mins.toString().length < 2 ? "0" + mins : mins}</span>
                <span>:</span>
                <span>
                  {second.toString().length < 2 ? "0" + second : second}
                </span>
              </div>
              <div className="controls">
                <div className="icon-control">
                  <img src={STORE_IMG + "chat.png"} alt="" />
                </div>

                <div
                  className="icon-control"
                  onClick={() => {
                    toogleStream("video");
                    setOpenVideo((prev) => !prev);
                  }}
                >
                  {isOpenVideo ? (
                    <i className="fa-solid fa-video-slash"></i>
                  ) : (
                    <i className="fa-solid fa-video"></i>
                  )}
                </div>
                <div className="icon-control">
                  <img
                    src={STORE_IMG + "call.png"}
                    alt=""
                    className="call-icon"
                    onClick={endCall}
                  />
                </div>
                <div
                  className="icon-mic icon-control"
                  onClick={() => {
                    toogleStream("audio");
                    setIsMic((prev) => !prev);
                  }}
                >
                  {isMic ? (
                    <img src={STORE_IMG + "mic.png"} alt="" />
                  ) : (
                    <i className="fa-solid fa-microphone-slash"></i>
                  )}
                </div>
                <div className="icon-control">
                  <img src={STORE_IMG + "cast.png"} alt="" />
                </div>
              </div>
            </div>
            <div className="content_right">
              <div className="joined">
                <p>People Joined</p>
                <div className="video-joins"></div>
              </div>
              <InviteFriend />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallModal;

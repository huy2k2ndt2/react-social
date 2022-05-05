import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { STORE_IMG } from "../../contants/imgContant";
import { END_CALL, SET_IS_ANSWER } from "../../redux/actions";

import "./modalCall.scss";
import NavModalCall from "./NavModalCall";
import Avatar from "../avatar/Avatar";
import { v4 as uuidv4 } from "uuid";
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
  const [isYouVideo, setIsYouVideo] = useState(true);

  const [uuidVideoPin, setUuidVideoPin] = useState("");

  const {
    isVideo,
    userReciverCall,
    isAnswer,
    isCreate,
    roomCallId,
    isSenderCall,
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
    peer?.on("call", (call) => {
      openStream(isVideo, false).then((stream) => {
        call.answer(stream);
        call.on("stream", (remoteStream) => {
          addVideoStream(remoteStream);
        });
      });
    });
    return () => peer?.removeListener("call");
  }, [peer, isVideo]);

  useEffect(() => {
    const timerId = setInterval(() => setTotal((prev) => prev + 1), 1000);

    return () => {
      setTotal(0);
      clearInterval(timerId);
    };
  }, []);

  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia({
  //       isVideo,
  //       audio: true,
  //     })
  //     .then((stream) => {
  //       const video = document.createElement("video");
  //       const divEl = document.createElement("div");
  //       divEl.classList.add(".video");
  //       video.srcObject = stream;
  //       video.play();
  //       divEl.append(video);
  //       const container = document.querySelector(".video-joins");
  //       if (container) {
  //         container.append(divEl);
  //       }

  //       addVideoStream(stream, true);

  //       peer.on("call", (call) => {
  //         call.answer(stream);
  //         call.on("stream", (remoteStream) => {
  //           addVideoStream(remoteStream);
  //         });
  //       });
  //     });
  // }, [peer, socket, isAnswer]);

  useEffect(() => {
    if (!socket) return;

    const handleUserCallOut = () => {
      toast.info(`${userReciverCall?.userName} got off the call`, {
        autoClose: 2000,
      });

      // if (isVideo) {
      //   const tracks = otherVideo.current.srcObject.getTracks();
      //   tracks.forEach((track) => track.stop());
      //   otherVideo.current.pause();

      //   newCall.close();
      //   setNewCall();
      // }

      // if (isAnswer) {
      //   otherVideo.pause();
      // }
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

    const handleSendStream = (peerId) => {
      openStream(isVideo, false).then((stream) => {
        if (!isAnswer) {
          addVideoStream(stream, true);
          dispatch({
            type: SET_IS_ANSWER,
            payload: true,
          });
        }

        const call = peer.call(peerId, stream);

        call.on("stream", (remoteStream) => {
          addVideoStream(remoteStream);
        });
      });
    };

    socket.on("user-joined-call", handleSendStream);
    socket.on("userCallOut", handleUserCallOut);
    socket.on("userCallBusy", (isClose) => {
      handleNotify(`${userReciverCall.userName} is on another call!`, isClose);
    });

    return () => {
      socket?.off("user-joined-call", handleSendStream);
      socket?.off("userCallOut", handleUserCallOut);
      socket?.off("userCallBusy");
      socket?.off("callRefused");
    };
  }, [socket, isAnswer]);

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

  const toogleCamera = () => {
    setIsYouVideo((prev) => !prev);

    // if (!isYouVideo) {
    //   tracks.forEach((track) => track.stop());
    // }

    // openStream(!isYouVideo, isMic).then((stream) => {
    //   playStream(youVideo.current, stream);

    //   if (!isYouVideo) {
    //     const tracks = stream.getTracks();
    //     setTracks(tracks);
    //   }

    //   // if (!isSenderCall) {
    //   //   console.log("chay vao day");
    //   //   const newCall = peer.call(peerId, stream);
    //   //   newCall?.on("stream", (remoteStream) => {
    //   //     console.log('nhan duoc stream');
    //   //     // playStream(otherVideo.current, remoteStream);
    //   //     otherVideo.current.srcObject = remoteStream;
    //   //     otherVideo.current.play();
    //   //   });

    //   //   setNewCall(newCall);
    //   // }
    // });
  };

  const handlePinVideo = (video) => {
    setUuidVideoPin(video.current.uuid);
  };

  const handleUnPin = () => {
    setUuidVideoPin("");
  };

  const handleCheckIcon = (video) => {
    if (!video || !video.current || !uuidVideoPin)
      return (
        <i
          className="fa-solid fa-thumbtack icon_video"
          onClick={() => handlePinVideo(video)}
        ></i>
      );
    return uuidVideoPin === video.current.uuid ? (
      <i
        className="fa-solid fa-circle-xmark icon_video"
        onClick={handleUnPin}
      ></i>
    ) : (
      <i
        className="fa-solid fa-thumbtack icon_video"
        onClick={() => handlePinVideo(video)}
      ></i>
    );
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

                <div className="icon-control" onClick={toogleCamera}>
                  {isYouVideo ? (
                    <i className="fa-solid fa-video-slash"></i>
                  ) : (
                    <i className="fa-solid fa-video"></i>
                  )}
                  {/* <img src={STORE_IMG + "disconnect.png"} alt="" /> */}
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
                  onClick={hanldeToogleMic}
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

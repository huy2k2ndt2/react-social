import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Avatar from "../avatar/Avatar";
import { format } from "timeago.js";
import { NO_AVATAR } from "../../contants/imgContant";

const CardFriend = ({ friend }) => {
  const [isDisable, setIsDisable] = useState(false);

  const { userCurrent } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.network);
  const { isVideo, roomCallId, conversationId } = useSelector(
    (state) => state.call
  );

  const timeRemaining = useRef();

  useEffect(() => {
    if (!isDisable || timeRemaining.current) return;
    const time = 5 * 60 * 1000;

    const date = new Date();

    timeRemaining.current = time + date.getTime();

    const removeDisable = () => {
      setIsDisable(false);
      timeRemaining.current = "";
    };
    const timer = setTimeout(removeDisable, 1000);

    return () => clearTimeout(timer);
  }, [isDisable]);

  const handleInviteFriend = (friendId) => {
    if (isDisable) {
      return toast.info(
        `Already invited this friend ${format(
          timeRemaining.current
        )} later can invite again`,
        { autoClose: 1000 }
      );
    }

    if (!socket || !userCurrent) return;
    socket.emit("createCall", {
      isVideo,
      sender: {
        profilePicture: userCurrent.profilePicture,
        userName: userCurrent.userName,
        _id: userCurrent?._id,
      },
      receiverId: friend?._id,
      roomCallId,
      isCreate: false,
      conversationId,
    });

    setIsDisable(true);
  };

  return (
    <>
      <Avatar
        width="60px"
        height="60px"
        user={friend}
        link={false}
        isShowOffline={false}
      />
      <p>{friend?.userName}</p>
      <button
        type="button"
        className="btn btn-info"
        onClick={handleInviteFriend}
      >
        {isDisable ? "Invited" : "Invite"}
      </button>
    </>
  );
};

export default CardFriend;

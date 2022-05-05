import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getDataAPI,
  postDataAPI,
  putDataAPI,
  deleteDataAPI,
} from "../../api/fetchData";
import ModalConfirmDelete from "../../components/modal/ModalConfirmDelete";
import {
  ADD_FRIEND,
  REMOVE_FRIEND,
  SET_STATUS_FRIEND,
} from "../../redux/actions";
import { v4 as uuidv4 } from "uuid";

const ButtonFriend = () => {
  const [friendRequest, setFriendRequest] = useState();
  const [statusFriend, setStatusFriend] = useState("");
  const { userCurrent } = useSelector((state) => state.auth);
  const { userProfile, isFriend } = useSelector((state) => state.profile);

  const { socket } = useSelector((state) => state.network);

  const idModalRemoveFriendRequest = useRef(uuidv4());
  const idModal = useRef(uuidv4());

  const dispatch = useDispatch();

  useEffect(() => {
    const addListFriend = (userId) => {
      dispatch({
        type: ADD_FRIEND,
        payload: userId,
      });
    };

    const removeListFriend = (userId) => {
      dispatch({
        type: REMOVE_FRIEND,
        payload: userId,
      });
    };

    const updateStatus = ({ status, friendRequest }) => {
      if (!status) {
        setStatusFriend("");
        setFriendRequest();
      } else {
        setStatusFriend(status);
        setFriendRequest(friendRequest);
      }
    };

    if (socket) {
      socket.on("addListFriend", addListFriend);
      socket.on("removeListFriend", removeListFriend);
      socket.on("updateStatus", updateStatus);
    }

    return () => {
      socket?.off("addListFriend", addListFriend);
      socket?.off("removeListFriend", removeListFriend);
      socket?.off("updateStatus", updateStatus);
    };
  }, [socket]);

  useEffect(() => {
    const handleCheckStatusFriend = async () => {
      const responses = await Promise.all([
        getDataAPI(
          `/friend-request?friendId=${userProfile?._id}&type=sender&status=1`
        ),
        getDataAPI(
          `/friend-request?friendId=${userProfile?._id}&type=receive&status=1`
        ),
      ]);

      let status = "";

      responses.forEach((response) => {
        const { message, friendRequestDb, type } = response;

        if (friendRequestDb) {
          setFriendRequest(friendRequestDb);
          status = type;
        }
      });

      return status;
    };

    const handleSetStatusFriend = async () => {
      if (userProfile && userCurrent) {
        if (isFriend) {
          setStatusFriend("friend");
        } else {
          const status = await handleCheckStatusFriend();
          setStatusFriend(status);
        }
      }
    };

    handleSetStatusFriend();
  }, [userProfile, userCurrent]);

  const createFriendRequest = async () => {
    try {
      const response = await postDataAPI("/friend-request", {
        receiverId: userProfile?._id,
      });

      const { message, friendRequestDb } = response;

      toast.success(message, { autoClose: 1000 });

      setFriendRequest(friendRequestDb);
      setStatusFriend("sender");

      socket?.emit("changeFriendRequest", {
        friendId: userProfile?._id,
        friendRequest: friendRequestDb,
        status: "receiver",
      });

      const responseCreateNotification = await postDataAPI("/notification", {
        link: `/profile/${userCurrent?._id}`,
        receiverId: userProfile?._id,
        text: userCurrent?.userName + " sent a friend request",
        senderId: userCurrent?._id,
      });

      const { notification } = responseCreateNotification;

      socket?.emit("createNotification", { notification });
    } catch (err) {
      console.log("err", err);
    }
  };

  const removeFriendRequest = async () => {
    try {
      if (friendRequest) {
        const response = await deleteDataAPI(
          `/friend-request/${friendRequest?._id}`
        );

        const { message } = response;

        // toast.success(message, { autoClose: 1000 });

        setFriendRequest();
        setStatusFriend("");

        socket?.emit("changeFriendRequest", {
          friendId: userProfile?._id,
          status: "",
        });
      } else {
        toast.error("An error occurred while making this request!!!", {
          autoClose: 1000,
        });
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const refuseFriendRequest = async () => {
    try {
      if (friendRequest) {
        const response = await putDataAPI(`/friend-request/refuse-request`, {
          friendRequestId: friendRequest?._id,
        });

        const { message } = response;

        toast.success(message, { autoClose: 1000 });

        setFriendRequest();
        setStatusFriend("");

        socket?.emit("changeFriendRequest", {
          friendId: userProfile?._id,
          status: "",
        });
      } else {
        toast.error("An error occurred while making this request!!!", {
          autoClose: 1000,
        });
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const acceptFriendRequest = async () => {
    try {
      if (friendRequest) {
        const response = await putDataAPI(
          `/friend-request/accept-friend-request`,
          {
            friendId: userProfile?._id,
            friendRequestId: friendRequest?._id,
          }
        );

        const { message } = response;

        toast.success(message, { autoClose: 1000 });

        setFriendRequest();
        setStatusFriend("friend");

        dispatch({
          type: ADD_FRIEND,
          payload: userProfile?._id,
        });

        dispatch({
          type: SET_STATUS_FRIEND,
          payload: true,
        });

        const responseCreateNotification = await postDataAPI("/notification", {
          link: `/profile/${userCurrent?._id}`,
          receiverId: userProfile?._id,
          text: userCurrent?.userName + " has accept friend request",
          senderId: userCurrent?._id,
        });

        const { notification } = responseCreateNotification;

        socket?.emit("acceptFriendRequest", {
          friendId: userProfile?._id,
          userId: userCurrent?._id,
          notification,
        });
      } else {
        toast.error("An error occurred while making this request!!!", {
          autoClose: 1000,
        });
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const unFriend = async () => {
    try {
      if (!friendRequest && statusFriend === "friend") {
        const response = await putDataAPI(`/friend-request/unfriend`, {
          friendId: userProfile?._id,
        });

        const { message } = response;

        toast.success(message, { autoClose: 1000 });

        setStatusFriend("");

        dispatch({
          type: REMOVE_FRIEND,
          payload: userProfile?._id,
        });

        dispatch({
          type: SET_STATUS_FRIEND,
          payload: false,
        });

        socket?.emit("removeFriend", {
          friendId: userProfile?._id,
          userId: userCurrent?._id,
        });
      } else {
        toast.error("An error occurred while making this request!!!", {
          autoClose: 1000,
        });
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <>
      {statusFriend ? (
        statusFriend === "friend" ? (
          <>
            <button className="card__action__button card__action--friend">
              friend
            </button>

            <button
              data-toggle="modal"
              data-target={`#${idModal.current}`}
              className="card__action__button card__action--unfriend"
            >
              Unfriend
            </button>
          </>
        ) : (
          <>
            {statusFriend === "sender" ? (
              <>
                <button
                  data-toggle="modal"
                  data-target={`#${idModalRemoveFriendRequest.current}`}
                  className="card__action__button card__action--deleteRequestFriend"
                >
                  Cancel friend request
                </button>
              </>
            ) : (
              <>
                <button
                  className="card__action__button card__action--acceptFriendRequset"
                  onClick={acceptFriendRequest}
                >
                  Accept friend request
                </button>

                <button
                  className="card__action__button card__action--refuseFriendRequset"
                  onClick={refuseFriendRequest}
                >
                  Refuse friend request
                </button>
              </>
            )}
          </>
        )
      ) : (
        <>
          <button
            className="card__action__button card__action--addFriend"
            onClick={createFriendRequest}
          >
            add friend
          </button>
        </>
      )}

      <ModalConfirmDelete
        id={idModalRemoveFriendRequest.current}
        text={"Are you sure you want to cancel this friend request?"}
        onRemove={removeFriendRequest}
      />

      <ModalConfirmDelete
        id={idModal.current}
        text={`You definitely want to unfriend ${userProfile?.userName}`}
        onRemove={unFriend}
      />
    </>
  );
};

export default ButtonFriend;

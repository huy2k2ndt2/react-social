import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { deleteDataAPI, postDataAPI, putDataAPI } from "../../api/fetchData";
import { REMOVE_FRIEND_REQUEST } from "../../redux/actions";

const ButtonActionsFriendRequest = ({ friendRequest, user }) => {
  const { type } = useSelector((state) => state.friendRequest);
  const { socket } = useSelector((state) => state.network);
  const { userCurrent } = useSelector((state) => state.auth);

  const status = useMemo(() => friendRequest.status, [friendRequest]);

  const dispatch = useDispatch();

  const acceptFriendRequest = async () => {
    try {
      if (friendRequest) {
        const response = await putDataAPI(
          `/friend-request/accept-friend-request`,
          {
            friendId: user?._id,
            friendRequestId: friendRequest?._id,
          }
        );

        const { message } = response;

        toast.success(message, { autoClose: 1000 });

        dispatch({
          type: REMOVE_FRIEND_REQUEST,
          payload: friendRequest?._id,
        });

        const responseCreateNotification = await postDataAPI("/notification", {
          link: "",
          userId: user?._id,
          text: userCurrent?.userName + " has accepted your friend request",
        });

        const { notification } = responseCreateNotification;

        // socket?.emit("acceptFriendRequest", {
        //   friendId: user?._id,
        //   userId: userCurrent?._id,
        // });
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

        dispatch({
          type: REMOVE_FRIEND_REQUEST,
          payload: friendRequest?._id,
        });

        const { message } = response;

        toast.success(message, { autoClose: 1000 });

        // socket?.emit("changeFriendRequest", {
        //   friendId: user?._id,
        //   status: "",
        // });
      } else {
        toast.error("An error occurred while making this request!!!", {
          autoClose: 1000,
        });
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const deleteFriendRequest = async () => {
    try {
      if (friendRequest) {
        const response = await deleteDataAPI(
          `/friend-request/${friendRequest?._id}`
        );

        dispatch({
          type: REMOVE_FRIEND_REQUEST,
          payload: friendRequest?._id,
        });

        const { message } = response;

        toast.success(message, { autoClose: 1000 });

        // socket?.emit("changeFriendRequest", {
        //   friendId: user?._id,
        //   status: "",
        // });
      } else {
        toast.error("An error occurred while making this request!!!", {
          autoClose: 1000,
        });
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const sendToFriendRequest = async () => {
    try {
      if (friendRequest) {
        const response = await putDataAPI(`/friend-request`, {
          friendRequestId: friendRequest?._id,
          status: 1,
        });

        dispatch({
          type: REMOVE_FRIEND_REQUEST,
          payload: friendRequest?._id,
        });

        const { message } = response;

        toast.success(message, { autoClose: 1000 });

        const responseCreateNotification = await postDataAPI("/notification", {
          link: "",
          userId: user?._id,
          text: userCurrent?.userName + " sent a friend request",
        });

        const { notification } = responseCreateNotification;

        socket?.emit("createNotification", { notification });
      } else {
        toast.error("An error occurred while making this request!!!", {
          autoClose: 1000,
        });
        throw new Error("Friend Request not Exit");
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <div className="button-actions">
      {type === "received" ? (
        <>
          <button
            type="button"
            className="btn btn-primary"
            onClick={acceptFriendRequest}
          >
            Accept
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={refuseFriendRequest}
          >
            Refusse
          </button>
        </>
      ) : (
        <>
          {status === 1 ? (
            <>
              <button
                type="button"
                className="btn btn-warning"
                onClick={deleteFriendRequest}
              >
                Cancel invitation
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-light"
                onClick={sendToFriendRequest}
              >
                Send to
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={deleteFriendRequest}
              >
                Remove
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ButtonActionsFriendRequest;

import React from "react";
import { toast } from "react-toastify";
import { putDataAPI, deleteDataAPI } from "../../api/fetchData";
import { useDispatch, useSelector } from "react-redux";
import "./notificationAction.scss";
import {
  REMOVE_FRIEND_REQUEST,
  REMOVE_NOTIFICATION,
  UPDATE_LIST_CONVERSATION,
} from "../../redux/actions";

const NotificationAction = ({ notification }) => {
  const { userCurrent } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleRemoveNotification = async () => {
    try {
      const response = await deleteDataAPI(
        `/notification/${notification._id}`
      );

      const { message } = response;

      toast.success(message, { autoClose: 1000 });

      dispatch({
        type: REMOVE_NOTIFICATION,
        payload: notification?._id,
      });
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleUnReadNotification = async () => {
    try {
      const response = await putDataAPI(
        `/notification/unRead/${notification._id}`
      );

      const { message, newNotification } = response;

      toast.success(message, { autoClose: 1000 });

      dispatch({
        type: UPDATE_LIST_CONVERSATION,
        payload: newNotification,
      });
    } catch (err) {
      console.log("err", err);
    }
  };

  const readNotification = async () => {
    try {
      const response = await putDataAPI(`/notification/${notification._id}`);

      const { message, newNotification } = response;

      toast.success(message, { autoClose: 1000 });

      dispatch({
        type: UPDATE_LIST_CONVERSATION,
        payload: newNotification,
      });
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <>
      <div className="notificationCrudAction">
        <button
          className={`${notification.isRead ? "disable" : ""} `}
          onClick={readNotification}
        >
          Mark
        </button>

        <button
          onClick={handleUnReadNotification}
          className={`${!notification.isRead ? "disable" : ""} `}
        >
          Unread
        </button>

        <button onClick={handleRemoveNotification}>Remove</button>
      </div>
    </>
  );
};

export default NotificationAction;

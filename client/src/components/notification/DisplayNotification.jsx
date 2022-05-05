import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../avatar/Avatar";
import { toast } from "react-toastify";
import * as timeago from "timeago.js";
import NotificationAction from "./NotificationAction";
import { getDataAPI, putDataAPI } from "../../api/fetchData";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_LIST_CONVERSATION } from "../../redux/actions";

const DisplayNotifycation = ({ notification }) => {
  const [user, setUser] = useState(null);

  const { userCurrent } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    let isMount = true;

    const fetchUser = async () => {
      if (!notification?.senderId) return;

      try {
        const response = await getDataAPI(
          `/user?userId=${notification?.senderId}`
        );

        const { user } = response;

        if (isMount) {
          setUser(user);
        }
      } catch (err) {
        console.log("err", err);
      }
    };
    fetchUser();

    return () => {
      isMount = false;
    };
  }, [notification]);

  const updateReadNotification = async () => {
    try {
      if (!notification || notification?.isRead || !userCurrent) return;

      const response = await putDataAPI(`/notification/${notification?._id}`);

      const { message, notification: newNotification } = response;
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
      <div className="circle"></div>
      <span className="time">{timeago.format(notification?.createdAt)}</span>
      <p
        className={`${notification?.isRead ? "read" : ""}`}
        onClick={() => {
          updateReadNotification();
          navigate(notification?.link);
        }}
      >
        <b>{user?.userName}</b>
        {notification?.text.slice(
          notification?.text.indexOf(user?.userName) + user?.userName?.length
        )}
      </p>
      <NotificationAction notification={notification} />
    </>
  );
};

export default DisplayNotifycation;

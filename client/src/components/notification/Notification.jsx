import React, { useState, useEffect } from "react";
import DisplayNotification from "./DisplayNotification";
import "./notification.scss";
import { debounce } from "../../helpers/debounceFunction";
import { toast } from "react-toastify";
import { putDataAPI, deleteDataAPI } from "../../api/fetchData";
import { useSelector, useDispatch } from "react-redux";
import {
  ADD_NOTIFICATION,
  ADD_NOTIFICATION_DISPLAY,
  SET_SHOW_NOTIFICATION_MENU,
} from "../../redux/actions";
import MenuNotifycation from "./MenuNotifycation";

const Notification = () => {
  const { userCurrent } = useSelector((state) => state.auth);
  const { type, listNotifycation, notificationDisplays, isShowMenu } =
    useSelector((state) => state.notification);
  const { socket } = useSelector((state) => state.network);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    const updateListNotification = ({ notification }) => {
      if (type === "all" && type === "read") {
        dispatch({
          type: ADD_NOTIFICATION_DISPLAY,
          payload: notification,
        });
      }

      dispatch({
        type: ADD_NOTIFICATION,
        payload: notification,
      });
    };

    socket.on("updateNotification", updateListNotification);

    return () => socket?.off("updateNotification", updateListNotification);
  }, [socket]);

  return (
    // <div
    //   className="notifycationContainer"
    //   style={{
    //     animation: "",
    //   }}
    // >
    //   <div className="notificationOptions">
    //     <button
    //       className="btn-notification allNotification"
    //
    //     >
    //       All Notification
    //     </button>
    //     <button
    //
    //       className="btn-notification notificationReads"
    //     >
    //       Read
    //     </button>
    //     <button
    //       className="btn-notification notificationNotReads"
    //
    //     >
    //       Unread
    //     </button>
    //     <button
    //       className="btn-notification removeAllNotifycation"
    //
    //     >
    //       Remove all notifications
    //     </button>
    //     <button
    //       className="btn-notification markAllAsRead"
    //
    //     >
    //       Mark all as read
    //     </button>
    //   </div>
    //   {notificationDisplays &&
    //     notificationDisplays.map((notification) => (
    //       <DisplayNotification
    //         notification={notification}
    //         key={notification?._id}
    //       />
    //     ))}
    // </div>

    <div className="frame">
      <div className={`panel ${isShowMenu && "show-menu"}`}>
        <div className="header flex">
          <div
            className="menu-icon"
            onClick={() => dispatch({ type: SET_SHOW_NOTIFICATION_MENU })}
          >
            <div className={`dash-top ${isShowMenu && "slide-top"}`}></div>
            <div className="dash-bottom"></div>
            <div className={`circle circle-1 ${isShowMenu && "slide"}`}></div>
          </div>
          <span className="title">Notifications</span>
        </div>

        <div className="notifications clearfix">
          <div className="line"></div>
          {notificationDisplays &&
            notificationDisplays.map((notification, idx) => (
              <div
                className="notification"
                key={notification?._id}
                style={{
                  animation: `here-am-i 0.5s ease-out ${0.4 + idx * 0.2}s`,
                  animationFillMode: "both",
                }}
              >
                <DisplayNotification
                  key={notification?._id}
                  notification={notification}
                />
              </div>
            ))}
        </div>
      </div>

      <MenuNotifycation />
    </div>
  );
};

export default Notification;

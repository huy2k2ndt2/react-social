import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { deleteDataAPI, putDataAPI } from "../../api/fetchData";
import { debounce } from "../../helpers/debounceFunction";
import {
  REMOVE_ALL_NOTIFICATION,
  SET_NOTIFICATIONs_DISPLAY,
  SET_TYPE_NOTIFICATION,
} from "../../redux/actions";

const MenuNotifycation = () => {
  const { isShowMenu, listNotifycation, type } = useSelector(
    (state) => state.notification
  );

  const setNotifications = (type) => {
    dispatch({
      type: SET_TYPE_NOTIFICATION,
      payload: type,
    });
  };

  const dispatch = useDispatch();

  useEffect(() => {
    let isMount = true;
    let payload;

    if (!listNotifycation) return;

    if (type === "all") payload = listNotifycation;
    else if (type === "unread") {
      payload = listNotifycation.filter((notification) => !notification.isRead);
    } else
      payload = listNotifycation.filter((notification) => notification.isRead);

    if (isMount) {
      dispatch({
        type: SET_NOTIFICATIONs_DISPLAY,
        payload,
      });
    }

    return () => (isMount = false);
  }, [type]);

  const removeAllNotification = async () => {
    try {
      const response = await deleteDataAPI(
        `/notification/delete-all-notification`
      );

      const { message } = response;

      dispatch({
        type: REMOVE_ALL_NOTIFICATION,
      });

      toast.success(message, { autoClose: 1000 });
    } catch (err) {
      console.log("err", err);
    }
  };

  const readAllNotification = async () => {
    try {
      const response = await putDataAPI(`/notification/read-all-notification`);

      const { message, notifications } = response;

      toast.success(message, { autoClose: 1000 });
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <div className={`menu ${isShowMenu && "active"}`}>
      <ul>
        <li
          className="hvr-underline-from-left"
          onClick={debounce(setNotifications, 500, "all")}
        >
          <span className="fa-solid fa-border-all"></span>All
        </li>
        <li
          className="hvr-underline-from-left"
          onClick={debounce(setNotifications, 500, "read")}
        >
          <span className="fa-solid fa-check-double"></span>Read
        </li>
        <li
          className="hvr-underline-from-left"
          onClick={debounce(setNotifications, 500, "unread")}
        >
          <span className="fa-solid fa-rectangle-xmark"></span>Un Read
        </li>
        <li
          className="hvr-underline-from-left"
          onClick={debounce(removeAllNotification, 500)}
        >
          <span className="fa-solid fa-trash-can"></span>Remove all
        </li>
        <li
          className="hvr-underline-from-left"
          onClick={debounce(readAllNotification, 500)}
        >
         <span className="fa-solid fa-marker"></span>Mark
        </li>
      </ul>
    </div>
  );
};

export default MenuNotifycation;

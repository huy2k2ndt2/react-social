import {
  SET_LIST_NOTIFICATION,
  ADD_NOTIFICATION,
  SET_NUMBER_NOTIFICATION_UNREAD,
  INCREASE_NUMBER_NOTIFICATION_UNREAD,
  DECREASE_NUMBER_NOTIFICATION_UNREAD,
  SET_SHOW_NOTIFICATION,
  SET_SHOW_NOTIFICATION_MENU,
  REMOVE_NOTIFICATION,
  SET_NOTIFICATIONs_DISPLAY,
  ADD_NOTIFICATION_DISPLAY,
  SET_TYPE_NOTIFICATION,
  REMOVE_ALL_NOTIFICATION,
  UPDATE_LIST_CONVERSATION,
} from "../actions";

import { addElment } from "../../helpers";

const initialState = {
  // first: true,
  isShow: false,
  isShowMenu: false,
  number: 0,
  listNotifycation: null,
  notificationDisplays: null,
  type: "all",
};

const chatReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_SHOW_NOTIFICATION: {
      return {
        ...state,
        isShow: payload,
        number: 0,
      };
    }

    case SET_LIST_NOTIFICATION: {
      return {
        ...state,
        listNotifycation: payload,
        // first: false,
        notificationDisplays: payload,
      };
    }

    case SET_NUMBER_NOTIFICATION_UNREAD: {
      return {
        ...state,
        number: payload,
      };
    }

    case INCREASE_NUMBER_NOTIFICATION_UNREAD: {
      return {
        ...state,
        number: state.number + 1,
      };
    }

    case DECREASE_NUMBER_NOTIFICATION_UNREAD: {
      return {
        ...state,
        number: state.number - 1,
      };
    }

    case ADD_NOTIFICATION: {
      return {
        ...state,
        listNotifycation: addElment(
          state.listNotifycation,
          payload,
          (array, payload) => array.find((el) => el?._id === payload?._id)
        ),
      };
    }

    case ADD_NOTIFICATION_DISPLAY: {
      return {
        ...state,
        notificationDisplays: addElment(
          state.notificationDisplays,
          payload,
          (array, payload) => array.find((el) => el?._id === payload?._id)
        ),
      };
    }

    case REMOVE_NOTIFICATION: {
      return {
        ...state,
        listNotifycation: state.listNotifycation.filter(
          (notification) => notification?._id !== payload
        ),
        notificationDisplays: state.notificationDisplays.filter(
          (notification) => notification?._id !== payload
        ),
      };
    }

    case SET_NOTIFICATIONs_DISPLAY: {
      return {
        ...state,
        notificationDisplays: payload,
      };
    }

    case SET_TYPE_NOTIFICATION: {
      const types = ["all", "read", "unread"];

      if (!types.includes(payload)) return { ...state };

      return {
        ...state,
        type: payload,
      };
    }

    case REMOVE_ALL_NOTIFICATION: {
      return {
        ...state,
        listNotifycation: [],
        notificationDisplays: [],
      };
    }

    case UPDATE_LIST_CONVERSATION: {
      return {
        ...state,
        listNotifycation: state.listNotifycation.map((el) =>
          el?._id === payload?._id ? payload : el
        ),
        notificationDisplays: state.notificationDisplays.map((el) =>
          el?._id === payload?._id ? payload : el
        ),
      };
    }

    case SET_SHOW_NOTIFICATION_MENU: {
      return {
        ...state,
        isShowMenu: !state.isShowMenu,
      };
    }

    default: {
      return state;
    }
  }
};

export default chatReducer;

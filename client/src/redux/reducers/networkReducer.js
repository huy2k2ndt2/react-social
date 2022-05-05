import {
  SET_SOCKET,
  SET_USERS_ONLINE,
  ADD_USER_ONLINE,
  REMOVE_USER_OFFLINE,
  RESET_NETWORK,
} from "../actions";
import { addElment } from "../../helpers";

const initialState = {
  firstConnect: true,
  socket: null,
  usersOnline: [],
  firstGetData: true,
};

const networkReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case RESET_NETWORK: {
      return {
        ...initialState,
      };
    }

    case SET_SOCKET: {
      return {
        ...state,
        socket: payload,
        firstConnect: false,
      };
    }

    case SET_USERS_ONLINE: {
      return {
        ...state,
        usersOnline: payload ? payload : [],
        firstGetData: false,
      };
    }

    case ADD_USER_ONLINE: {
      return {
        ...state,
        usersOnline: addElment(state.usersOnline, payload),
      };
    }

    case REMOVE_USER_OFFLINE: {
      return {
        ...state,
        usersOnline: state.usersOnline.filter((user) => user !== payload),
      };
    }

    default: {
      return state;
    }
  }
};

export default networkReducer;

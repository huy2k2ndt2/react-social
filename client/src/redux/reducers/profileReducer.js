import { SET_STATUS_FRIEND, SET_USER_PROFILE, SET_IS_ME } from "../actions";

import { addElment } from "../../helpers";

const initialState = {
  isFriend: null,
  userProfile: null,
  isMe: false,
};

const chatReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {

    
    case SET_STATUS_FRIEND: {
      return {
        ...state,
        isFriend: payload,
      };
    }

    case SET_USER_PROFILE: {
      const { userProfile, isFriend } = payload;
      return {
        ...state,
        userProfile,
        isFriend,
      };
    }

    case SET_IS_ME: {
      return {
        ...state,
        isMe: true,
        userProfile: payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default chatReducer;

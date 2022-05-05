import {
  SET_CALL,
  END_CALL,
  SET_IS_ANSWER,
  SET_IS_MIC,
  SET_FRIEND_INVITES,
  SET_INFO_INVITE,
  SET_IS_INVITED,
  REFUSE_INVITE,
  SET_ACCEPT_INVITE,
} from "../actions";

const initialState = {
  isVideo: null,
  isCall: null,
  userSendCall: null,
  userReciverCall: null,
  isSenderCall: false,
  isAnswer: false,
  isMic: true,
  friendInvites: [],
  fristLoadFriends: true,
  isCreate: null,
  roomCallId: null,
};

const networkReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case REFUSE_INVITE: {
      return {
        ...state,
        isCreate: false,
        isCall: false,
        isVideo: null,
        userSendCall: null,
      };
    }

    case SET_ACCEPT_INVITE: {
      return {
        ...state,
        isAnswer: true,
        isCall: true,
        isCreate: false,
      };
    }

    case SET_FRIEND_INVITES: {
      return {
        ...state,
        friendInvites: payload,
        fristLoadFriends: false,
      };
    }

    case SET_CALL: {
      return {
        ...state,
        ...payload,
      };
    }

    case END_CALL: {
      return {
        ...state,
        isCall: false,
        isVideo: null,
        userSendCall: null,
      };
    }

    case SET_IS_ANSWER: {
      return {
        ...state,
        isAnswer: payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default networkReducer;

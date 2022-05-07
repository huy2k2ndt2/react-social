import {
  SET_CALL,
  END_CALL,
  SET_IS_ANSWER,
  SET_IS_COMPLETE,
  SET_FRIEND_INVITES,
  SET_USER_STREAM,
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
  friendInvites: [],
  fristLoadFriends: true,
  isCreate: null,
  roomCallId: null,
  userStream: null,
  conversationId: null,
  isComplete: false,
};

const networkReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_IS_COMPLETE: {
      return {
        ...state,
        isComplete: true,
      };
    }

    case SET_USER_STREAM: {
      return {
        ...state,
        userStream: payload,
      };
    }

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
      const { userStream } = state;
      if (userStream) {
        const tracks = userStream.getTracks();
        tracks.forEach((track) => track.stop());
      }

      return {
        ...initialState,
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

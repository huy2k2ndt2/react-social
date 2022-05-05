import {
  SET_TYPE,
  SET_LIST_FRIEND_REQUEST,
  ADD_LIST_FRIEND_REQUEST,
  REMOVE_FRIEND_REQUEST,
  INCREASE_NUMBER_FRIEND_REQUEST,
  SET_NUMBER_FRIEND_REQUEST,
  UPDATE_FRIEND_REQUEST,
} from "../actions";

const initialState = {
  type: "received",
  listFriendRequest: null,
  number: 0,
};

const friendRequestReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_TYPE: {
      const types = ["received", "sent"];
      if (!types.includes(payload)) return { ...state };

      return {
        ...state,
        type: payload,
      };
    }
    case SET_LIST_FRIEND_REQUEST: {
      return {
        ...state,
        listFriendRequest: payload,
        number: payload.length,
      };
    }
    case ADD_LIST_FRIEND_REQUEST: {
      const isExit = state.listFriendRequest.find(
        (friendRequest) => friendRequest?._id === payload?._id
      );

      if (isExit)
        return {
          ...state,
        };

      return {
        ...state,
        listFriendRequest: [payload, ...state.listFriendRequest],
        number: state.number + 1,
      };
    }

    case REMOVE_FRIEND_REQUEST: {
      return {
        ...state,
        listFriendRequest: state.listFriendRequest.filter(
          (friendRequest) => friendRequest?._id !== payload
        ),
        number: state.number - 1,
      };
    }

    case INCREASE_NUMBER_FRIEND_REQUEST: {
      return {
        ...state,
        number: state.number + 1,
      };
    }

    case SET_NUMBER_FRIEND_REQUEST: {
      return {
        ...state,
        number: payload,
      };
    }

  

    default: {
      return state;
    }
  }
};

export default friendRequestReducer;

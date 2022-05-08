import { addElment } from "../../helpers";
import {
  SET_CREATE_ROOM,
  ADD_FRIEND_TO_ROOM,
  REMOVE_FRIEND_TO_ROOM,
  SET_LIST_FRIEND,
  RESET_CREATE_ROOM,
} from "../actions";

const initialState = {
  isCreate: false,
  friends: [],
  friendAdds: [],
};

const createRoomChatReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case RESET_CREATE_ROOM: {
      return {
        ...state,
        ...initialState,
      };
    }

    case SET_LIST_FRIEND: {
      return {
        ...state,
        friends: payload,
      };
    }

    case SET_CREATE_ROOM: {
      return {
        ...state,
        isCreate: payload,
      };
    }

    case ADD_FRIEND_TO_ROOM: {
      return {
        ...state,
        friendAdds: addElment(state.friendAdds, payload, (array, value) =>
          array.find((el) => el?._id === value?._id)
        ),
        friends: state.friends.filter((friend) => friend?._id !== payload?._id),
      };
    }

    case REMOVE_FRIEND_TO_ROOM: {
      return {
        ...state,
        friends: addElment(state.friends, payload, (array, value) =>
          array.find((el) => el?._id === value?._id)
        ),
        friendAdds: state.friendAdds.filter(
          (friend) => friend?._id !== payload?._id
        ),
      };
    }

    default: {
      return state;
    }
  }
};

export default createRoomChatReducer;

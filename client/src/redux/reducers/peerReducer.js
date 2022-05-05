import { SET_PEER, SET_USER_PROFILE, SET_IS_ME } from "../actions";

const initialState = null;

const peerReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_PEER: {
      return payload;
    }

    default: {
      return state;
    }
  }
};

export default peerReducer;

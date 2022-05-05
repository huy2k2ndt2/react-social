import { SET_FILES, ADD_FILE, REMOVE_FILE } from "../actions";

const initialState = {
  files: [],
};

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_FILES: {
      return {
        ...state,
        files: payload,
      };
    }
    case ADD_FILE: {
      const isExit = state.files.find((file) => file?.uuid === payload?.uuid);

      if (isExit)
        return {
          ...state,
        };

      return {
        ...state,
        files: [payload, ...state.files],
      };
    }
    case REMOVE_FILE: {
      return {
        ...state,
        files: state.files.filter((file) => file?.uuid !== payload),
      };
    }

    default: {
      return state;
    }
  }
};

export default authReducer;

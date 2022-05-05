import {
  UPDATE_LAST_MESSAGE,
  UPDATE_STATUS_CONVERSATION,
  SET_STATUS_CONVERSATION,
  SET_CHAT,
  SET_CONVERSATION_CHAT,
  SET_LIST_CONVERSATION,
  ADD_CONVERSATION,
  ADD_STATUS_CONVERSATION,
  DISPLAY_CONVERSATION_PENDING,
  DISPLAY_CONVERSATION_ACCEPTS,
  UPDATE_CONVERSATION_DISPLAYS,
  UPDATE_FRIEND_CHAT,
  SET_NUMBER_UNREAD,
  INCREASE_NUMBER_UNREAD,
  DECREASE_NUMBER_UNREAD,
} from "../actions";

const initialState = {
  lastMessageConversation: null,
  statusConversations: [],
  friendChat: null,
  isChat: false,
  number: 0,
  conversationList: null,
  conversationChat: null,
  conversationPendings: null,
  conversationAccepts: null,
  conversationDisplays: null,
};

const chatReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_LAST_MESSAGE: {
      return {
        ...state,
        lastMessageConversation: payload,
      };
    }

    case UPDATE_STATUS_CONVERSATION: {
      const { conversationId, isRead } = payload;
      return {
        ...state,
        statusConversations: state.statusConversations.map((conversation) =>
          conversation.conversationId === conversationId
            ? {
                ...conversation,
                isRead,
              }
            : conversation
        ),
      };
    }

    case ADD_STATUS_CONVERSATION: {
      return {
        ...state,
        statusConversations: [payload, ...state.statusConversations],
      };
    }

    case SET_STATUS_CONVERSATION: {
      return {
        ...state,
        statusConversations: payload,
      };
    }

    case SET_CHAT: {
      return {
        ...state,
        isChat: payload,
      };
    }

    case SET_LIST_CONVERSATION: {
      const { userId, conversations } = payload;
      const conversationAccepts = conversations.filter((conversation) => {
        const idx = conversation.members.indexOf(userId);
        return conversation.status[idx];
      });
      const conversationPendings = conversations.filter((conversation) => {
        const idx = conversation.members.indexOf(userId);
        return !conversation.status[idx];
      });

      return {
        ...state,
        conversationList: conversations,
        conversationPendings,
        conversationAccepts,
        conversationDisplays: conversationAccepts,
      };
    }

    case ADD_CONVERSATION: {
      const isExit = state.conversationList.find(
        (conversation) => conversation?._id === payload?._id
      );

      if (isExit)
        return {
          ...state,
        };

      return {
        ...state,
        conversationAccepts: [payload, ...state.conversationAccepts],
        conversationDisplays: [payload, ...state.conversationAccepts],
        conversationList: [payload, ...state.conversationList],
      };
    }

    case UPDATE_CONVERSATION_DISPLAYS: {
      const isExit = state.conversationAccepts.find(
        (conversation) => conversation?._id === payload?._id
      );

      if (isExit)
        return {
          ...state,
        };

      const conversationAccepts = [payload, ...state.conversationAccepts];

      const conversationPendings = state.conversationPendings.filter(
        (conversation) => conversation?._id !== payload?._id
      );

      return {
        ...state,
        conversationAccepts,
        conversationDisplays: conversationAccepts,
        conversationPendings,
      };
    }

    case SET_CONVERSATION_CHAT: {
      const { friend, ...conversation } = payload;

      return {
        ...state,
        conversationChat: conversation,
        friendChat: friend,
      };
    }

    case DISPLAY_CONVERSATION_PENDING: {
      return {
        ...state,
        conversationDisplays: [...state.conversationPendings],
      };
    }

    case DISPLAY_CONVERSATION_ACCEPTS: {
      return {
        ...state,
        conversationDisplays: [...state.conversationAccepts],
      };
    }

    case UPDATE_FRIEND_CHAT: {
      return {
        ...state,
        friendChat: {
          ...state.friendChat,
          lastLogin: payload,
        },
      };
    }

    case SET_NUMBER_UNREAD: {
      return {
        ...state,
        number: payload,
      };
    }

    case INCREASE_NUMBER_UNREAD: {
      return {
        ...state,
        number: state.number + 1,
      };
    }

    case DECREASE_NUMBER_UNREAD: {
      return {
        ...state,
        number: state.number - 1,
      };
    }

    default: {
      return state;
    }
  }
};

export default chatReducer;

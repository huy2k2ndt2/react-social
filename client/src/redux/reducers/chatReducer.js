import { addElment } from "../../helpers";
import {
  UPDATE_LAST_MESSAGE,
  UPDATE_STATUS_CONVERSATION,
  SET_STATUS_CONVERSATION,
  SET_CHAT,
  SET_CONVERSATION_CHAT,
  SET_LIST_CONVERSATION,
  ADD_CONVERSATION_ACCEPTS,
  SET_IS_SHOW,
  DISPLAY_CONVERSATION_ACCEPTS,
  UPDATE_CONVERSATION_DISPLAYS,
  UPDATE_FRIEND_CHAT,
  SET_NUMBER_UNREAD,
  INCREASE_NUMBER_UNREAD,
  DECREASE_NUMBER_UNREAD,
  UPDATE_CONVERSATION,
  ADD_CONVERSATION_PENDINGS,
  ADD_CONVERSATION,
  UPDATE_READ_CONVERSATION,
  SET_NEW_CONVERSATION_CHAT,
} from "../actions";

const initialState = {
  lastMessageConversation: null,
  isChat: false,
  number: 0,
  conversationChat: null,
  conversationUnReads: [],
  listConversation: [],
  isShowConversationPending: false,
};

const chatReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_IS_SHOW: {
      return {
        ...state,
        isShowConversationPending: payload,
      };
    }

    case UPDATE_CONVERSATION: {
      const { conversationId, ...newInfo } = payload;

      const { listConversation } = state;

      return {
        ...state,
        listConversation: listConversation.map((conversation) =>
          conversation._id === conversationId
            ? {
                ...conversation,
                ...newInfo,
              }
            : conversation
        ),
      };
    }

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

    case SET_STATUS_CONVERSATION: {
      return {
        ...state,
        statusConversations: payload,
      };
    }

    case SET_CHAT: {
      return {
        ...state,
        ...payload,
        number: 0,
      };
    }

    case SET_LIST_CONVERSATION: {
      const { userId, conversations } = payload;

      const conversationUnReads = [];
      conversations.forEach((conversation) => {
        const { reads, status, _id } = conversation;

        if (status.includes(userId)) {
          if (!reads.includes(userId)) conversationUnReads.push(_id);
        }
      });

      return {
        ...state,
        listConversation: conversations,
        conversationUnReads,
      };
    }

    case ADD_CONVERSATION: {
      const { conversation } = payload;

      const { listConversation } = state;

      return {
        ...state,
        listConversation: addElment(
          listConversation,
          conversation,
          (array, value) => array.find((el) => el._id !== value._id)
        ),
      };
    }

    case UPDATE_READ_CONVERSATION: {
      const { conversationId, userId } = payload;

      return {
        ...state,
        conversationAccepts: state.conversationAccepts.map((conversation) =>
          conversation._id === conversationId
            ? {
                ...conversation,
                reads: [...conversation.reads, userId],
              }
            : conversation
        ),
        conversationDisplays: state.conversationDisplays.map((conversation) =>
          conversation._id === conversationId
            ? {
                ...conversation,
                reads: [...conversation.reads, userId],
              }
            : conversation
        ),
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
      const { conversationChat, isChangeType } = payload;

      const { isShowConversationPending, listConversation } = state;
      return {
        ...state,
        listConversation: listConversation.map((conversation) =>
          conversation._id === conversationChat._id
            ? conversationChat
            : conversation
        ),
        conversationChat,
        isShowConversationPending: isChangeType
          ? !isShowConversationPending
          : isShowConversationPending,
      };
    }

    case SET_NEW_CONVERSATION_CHAT: {
      const { conversationChat } = payload;
      return {
        ...state,
        conversationChat,
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
        conversationUnReads: addElment(state.conversationUnReads, payload),
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

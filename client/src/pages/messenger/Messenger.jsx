import "./messenger.scss";

import { useEffect, useRef, useState } from "react";
import { getDataAPI, postDataAPI } from "../../api/fetchData";
import { useDispatch, useSelector } from "react-redux";

import Conversation from "../../components/conversation/Conversation";
import ChatRoom from "./ChatRoom";
import OptionsMessage from "./OptionsMessage";
import ModalCreateRoomChat from "../../components/ModalCreateRoomChat/ModalCreateRoomChat";

import {
  SET_LIST_CONVERSATION,
  UPDATE_STATUS_CONVERSATION,
  SET_CONVERSATION_CHAT,
  UPDATE_CONVERSATION_DISPLAYS,
} from "../../redux/actions/chatActions";
import { toast } from "react-toastify";
import { SET_CREATE_ROOM } from "../../redux/actions";

export default function Messenger() {
  const { userCurrent } = useSelector((state) => state.auth);
  const { isCreate } = useSelector((state) => state.createRoomChat);
  const { conversationChat, conversationDisplays, conversationAccepts } =
    useSelector((state) => state.chat);

  const dispatch = useDispatch();

  useEffect(() => {
    let isMount = true;

    const getConversations = async () => {
      if (userCurrent) {
        try {
          const response = await getDataAPI(
            `/conversation/get-all-conversations`
          );

          let { message, conversations } = response;

          // toast.success(message, { autoClose: 2000 });

          conversations = conversations.map((conversation) => {
            if (conversation.roomCallId) {
              return {
                ...conversation,
                lastMessage: ["notify", `${"Conversation going on"}`],
              };
            }

            return conversation;
          });

          if (isMount) {
            dispatch({
              type: SET_LIST_CONVERSATION,
              payload: {
                userId: userCurrent?._id,
                conversations,
              },
            });
          }
        } catch (err) {
          console.log("err", err);
        }
      }
    };
    getConversations();

    return () => (isMount = false);
  }, [userCurrent]);

  useEffect(() => {
    const handleUpdateConversation = async () => {
      try {
        const idx = conversationChat?.members.indexOf(userCurrent?._id);
        if (!conversationChat.reads[idx]) {
          const response = await postDataAPI(
            `/conversation/update-conversation`,
            {
              userId: userCurrent?._id,
              conversationId: conversationChat?._id,
              isRead: true,
            }
          );

          const { message } = response;
        }

        if (!conversationChat.status[idx]) {
          const response = await postDataAPI(
            `/conversation/update-conversation`,
            {
              userId: userCurrent?._id,
              conversationId: conversationChat?._id,
              isStatus: true,
            }
          );

          const { message } = response;
        }

        // toast.success(message, { autoClose: 2000 });
      } catch (err) {
        console.log("err", err);
      }
    };

    if (conversationChat) {
      handleUpdateConversation();
    }
  }, [conversationChat]);

  const handleChosseCurrentChat = async (conversation) => {
    if (!conversationAccepts.find((el) => el?._id === conversation?._id)) {
      dispatch({
        type: UPDATE_CONVERSATION_DISPLAYS,
        payload: conversation,
      });
    }
    dispatch({
      type: SET_CONVERSATION_CHAT,
      payload: conversation,
    });

    dispatch({
      type: UPDATE_STATUS_CONVERSATION,
      payload: {
        conversationId: conversation?._id,
        isRead: true,
      },
    });
  };

  return (
    <>
      <div className="center">
        <div className="contacts">
          <div className="options-chat">
            <i className="fas fa-bars fa-2x"></i>
            <div className="list_options_chat">
              <button
                onClick={() => {
                  dispatch({
                    type: SET_CREATE_ROOM,
                    payload: true,
                  });
                }}
              >
                Create chat room
              </button>
            </div>
          </div>

          <OptionsMessage />

          <div className="contacts-container">
            {conversationDisplays &&
              conversationDisplays.map((conversation) => (
                <div
                  className="contact"
                  key={conversation?._id}
                  onClick={() => {
                    // setConversationChat(conversation);
                    handleChosseCurrentChat(conversation);
                  }}
                >
                  <Conversation conversation={conversation} />
                </div>
              ))}
          </div>
        </div>
        <div className="chat">
          <ChatRoom conversationChat={conversationChat} />
        </div>
      </div>

      {isCreate && <ModalCreateRoomChat />}
    </>
  );
}

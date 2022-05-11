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
  SET_CONVERSATION_CHAT,
} from "../../redux/actions/chatActions";
import { toast } from "react-toastify";
import { SET_CREATE_ROOM } from "../../redux/actions";

export default function Messenger() {
  const [conversationDisplays, setConversationDisplays] = useState([]);

  const { userCurrent } = useSelector((state) => state.auth);
  const { isCreate } = useSelector((state) => state.createRoomChat);
  const { conversationChat, listConversation, isShowConversationPending } =
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
    if (!listConversation || !userCurrent) return;

    const { _id } = userCurrent;

    let data;

    if (isShowConversationPending) {
      data = listConversation.filter(
        (conversation) => !conversation.status.includes(_id)
      );
    } else {
      data = listConversation.filter((conversation) =>
        conversation.status.includes(_id)
      );
    }

    setConversationDisplays(data);
  }, [listConversation, isShowConversationPending, userCurrent]);

  const handleChosseCurrentChat = async (conversation) => {
    if (!conversationChat || conversation?._id !== conversationChat._id) {
      const { _id } = userCurrent;
      const { status, reads } = conversation;

      const dataUpdate = {};
      let isChangeType = false;

      if (!status.includes(_id)) {
        isChangeType = true;

        dataUpdate.status = [...status, _id];
      }

      if (!reads.includes(_id)) {
        dataUpdate.reads = [...reads, _id];
      }

      if (Object.entries(dataUpdate).length) {
        const response = await postDataAPI(
          "/conversation/update-conversation",
          {
            conversationId: conversation?._id,
            ...dataUpdate,
          }
        );
      }

      dispatch({
        type: SET_CONVERSATION_CHAT,
        payload: {
          conversationChat: {
            ...conversation,
            ...dataUpdate,
          },
          isChangeType,
        },
      });
    }
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

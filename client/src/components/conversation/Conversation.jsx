import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../avatar/Avatar";
import { getDataAPI } from "../../api/fetchData";
import { NO_AVATAR } from "../../contants/imgContant";
import { UPDATE_CONVERSATION } from "../../redux/actions";
import { v4 as uuidv4 } from "uuid";

export default function Conversation({ conversation }) {
  const {
    _id: id,
    reads,
    members,
    isMultiple,
    name,
    image,
    listMembers,
    images,
    nameConversation,
  } = conversation;
  const [message, setMessage] = useState("");
  const [isRead, setIsRead] = useState(true);
  const [lastMessage, setLastMessage] = useState(
    () => conversation.lastMessage || ""
  );

  const { userCurrent } = useSelector((state) => state.auth);
  const { lastMessageConversation, statusConversations } = useSelector(
    (state) => state.chat
  );

  const dispatch = useDispatch();

  useEffect(() => {
    let isMount = true;
    if (!conversation) return;

    const handeGetInfoMembers = async () => {
      const listMemberIds = members.filter(
        (memberId) => memberId !== userCurrent?._id
      );

      const responses = await Promise.all(
        listMemberIds.map((memberId) => getDataAPI(`/user?userId=${memberId}`))
      );

      const listMembers = responses.map((response) => {
        const { user } = response;
        return user;
      });

      if (isMount) {
        dispatch({
          type: UPDATE_CONVERSATION,
          payload: {
            conversationId: conversation?._id,
            listMembers,
          },
        });
      }
    };

    if (!listMembers) {
      handeGetInfoMembers();
    }

    return () => (isMount = false);
  }, [conversation, listMembers]);

  useEffect(() => {
    let isMount = true;
    if (!conversation || !userCurrent) return;

    const handleSetImgConversation = async () => {
      if (isMultiple) {
        //get img conversation
        if (image.length) {
          if (isMount)
            dispatch({
              type: UPDATE_CONVERSATION,
              payload: {
                conversationId: conversation?._id,
                images: [
                  {
                    src: image[0],
                    key: uuidv4(),
                  },
                ],
              },
            });
        }
      }
    };

    if (!images) handleSetImgConversation();

    return () => (isMount = false);
  }, [conversation, userCurrent, images]);

  useEffect(() => {
    if (!conversation || !userCurrent || nameConversation) return;

    if (isMultiple) {
      dispatch({
        type: UPDATE_CONVERSATION,
        payload: {
          conversationId: conversation?._id,
          nameConversation: name,
        },
      });
    } else {
      if (!listMembers) return;
      const { userName } = listMembers[0];
      dispatch({
        type: UPDATE_CONVERSATION,
        payload: {
          conversationId: conversation?._id,
          nameConversation: userName,
        },
      });
    }
  }, [conversation, userCurrent, nameConversation, listMembers, name]);

  useEffect(() => {
    if (!reads || !userCurrent) return;

    setIsRead(() => reads.includes(userCurrent._id));
  }, [reads, userCurrent]);

  useEffect(() => {
    if (
      !lastMessageConversation ||
      lastMessageConversation?.conversationId !== id
    )
      return;

    setLastMessage(lastMessageConversation);
  }, [lastMessageConversation]);

  useEffect(() => {
    if (!listMembers || !userCurrent || (images && images.length > 0)) return;

    let listImages = [];

    if (isMultiple) {
      const ids = [];
      const length = members.length;
      for (let i = 0; i < 2; ++i) {
        let check;
        do {
          const idxRamdom = Math.floor(Math.random() * length);
          if (!ids.includes(members[idxRamdom])) {
            ids.push(members[idxRamdom]);
            check = true;
          }
        } while (!check);
      }

      listImages = ids.map((id) => {
        let img;

        if (id === userCurrent?._id) {
          img = userCurrent.profilePicture;
        } else {
          img = listMembers.find((member) => member?._id === id).profilePicture;
        }

        return {
          src: img && img.length ? img[0] : NO_AVATAR,
          key: uuidv4(),
        };
      });
    } else {
      const { profilePicture } = listMembers[0];

      listImages.push({
        src: profilePicture.length ? profilePicture[0] : NO_AVATAR,
        key: uuidv4(),
      });
    }

    dispatch({
      type: UPDATE_CONVERSATION,
      payload: {
        conversationId: conversation?._id,
        images: listImages,
      },
    });
  }, [listMembers, members, images, userCurrent]);

  useEffect(() => {
    if (!lastMessage || !listMembers || !userCurrent) return;
    const { isNotify, senderId, notify, text } = lastMessage;

    // if (isNotify) {
    //   let message;
    //   if (senderId) {
    //     const { userName } = friendContact;

    //     message =
    //       userCurrent?._id === senderId
    //         ? `${userName} missed your call`
    //         : `You missed the call with ${userName}`;
    //   } else {
    //     message = notify[0];
    //   }
    //   return setMessage(message);
    // }

    let data;

    if (senderId === userCurrent?._id) {
      data = "You";
    } else {
      const sender = listMembers.find((member) => member?._id === senderId);
      data = handleGetName(sender?.userName);
    }

    setMessage(data + ": " + text);
  }, [lastMessage, listMembers]);

  const handleGetName = (name) => {
    const data = name.split(" ");
    const length = data.length;

    if (!data || !length) {
      return name?.userName || "";
    }

    return data[length - 1];
  };

  return (
    <>
      <div className="pic banner">
        {/* <Avatar user={friendContact} width="64px" height="64px" link={false} /> */}

        {images &&
          (images.length === 1 ? (
            <img className="one-img" src={images[0].src} alt="" />
          ) : (
            <div className="multiple-img">
              {images.map((img) => (
                <img src={img.src} key={img.key} />
              ))}
            </div>
          ))}
      </div>

      <div className={`name ${!isRead ? "unread" : ""}`}>
        {nameConversation}
      </div>
      <div className={`message ${!isRead ? "unread" : ""}`}>
        {lastMessage?.[0] === "notify" ? lastMessage?.[1] : message}
      </div>
      {!isRead && <div className="NotificationCircle"></div>}
    </>
  );
}

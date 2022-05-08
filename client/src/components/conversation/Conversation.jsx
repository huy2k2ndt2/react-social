import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Avatar from "../avatar/Avatar";
import { getDataAPI } from "../../api/fetchData";
import { NO_AVATAR } from "../../contants/imgContant";

export default function Conversation({ conversation }) {
  const { _id: id, reads, members, isMultiple, name, image } = conversation;
  const [message, setMessage] = useState("");
  const [nameConversation, setNameConversation] = useState("");
  const [imgConversation, setImgConversation] = useState("");
  const [isRead, setIsRead] = useState(true);
  const [lastMessage, setLastMessage] = useState(
    () => conversation.lastMessage || ""
  );

  const { userCurrent } = useSelector((state) => state.auth);
  const { lastMessageConversation, statusConversations } = useSelector(
    (state) => state.chat
  );

  useEffect(() => {
    let isMount = true;
    if (!conversation || !userCurrent) return;

    const handleSetInfoConversation = async () => {
      if (isMultiple) {
        //get img conversation
        if (image.length) {
          if (isMount) setImgConversation([image[0]]);
        } else {
          const length = members.length;
          const friendIds = [];
          for (let i = 0; i < 2; ++i) {
            let check;
            do {
              const idxRamdom = Math.floor(Math.random() * length);
              if (!friendIds.includes(members[idxRamdom])) {
                friendIds.push(members[idxRamdom]);
                check = true;
              }
            } while (!check);
          }

          const responses = await Promise.all(
            friendIds.map((friendId) => getDataAPI(`/user?userId=${friendId}`))
          );

          const images = responses.map((response) => {
            const {
              user: { profilePicture },
            } = response;

            return profilePicture.length ? profilePicture[0] : NO_AVATAR;
          });

          setImgConversation(images);
        }

        setNameConversation(name);
      } else {
        const friendChatId = members.find(
          (memberId) => memberId !== userCurrent?._id
        );

        const { user } = await getDataAPI(`/user?userId=${friendChatId}`);

        const { profilePicture, userName } = user;

        if (isMount) {
          setImgConversation([
            profilePicture && profilePicture.length
              ? profilePicture[0]
              : NO_AVATAR,
          ]);
          setNameConversation(userName);
        }
      }
    };

    handleSetInfoConversation();

    return () => (isMount = false);
  }, [conversation, userCurrent]);

  useEffect(() => {
    if (!reads || !reads.length || !members || !members.length) return;
    const idx = members.indexOf(userCurrent?._id);
    setIsRead(reads[idx]);
  }, [reads]);

  useEffect(() => {
    if (!statusConversations || !statusConversations.length) return;

    const conversation = statusConversations.find(
      (statusConversation) => statusConversation.conversationId === id
    );

    if (!conversation) return;

    if (isRead === conversation.isRead) {
      return;
    }

    setIsRead(conversation.isRead);
  }, [statusConversations]);

  useEffect(() => {
    if (
      !lastMessageConversation ||
      lastMessageConversation?.conversationId !== id
    )
      return;

    setLastMessage(lastMessageConversation);
  }, [lastMessageConversation]);

  // useEffect(() => {
  //   if (!lastMessage) return;
  //   const { isNotify, senderId, notify, text } = lastMessage;

  //   if (isNotify) {
  //     let message;
  //     if (senderId) {
  //       const { userName } = friendContact;

  //       message =
  //         userCurrent?._id === senderId
  //           ? `${userName} missed your call`
  //           : `You missed the call with ${userName}`;
  //     } else {
  //       message = notify[0];
  //     }
  //     return setMessage(message);
  //   }
  //   const data = senderId === userCurrent?._id ? "You" : handleGetName();

  //   setMessage(data + ": " + text);
  // }, [lastMessage]);

  // const handleGetName = () => {
  //   const data = friendContact?.userName.split(" ");
  //   const length = data.length;

  //   if (!data || !length) {
  //     return friendContact?.userName || "";
  //   }

  //   return data[length - 1];
  // };

  return (
    <></>
    // <>
    //   <div className="pic banner">
    //     <Avatar user={friendContact} width="64px" height="64px" link={false} />
    //   </div>

    //   <div className={`name ${!isRead ? "unread" : ""}`}>
    //     {nameConversation}
    //   </div>
    //   <div className={`message ${!isRead ? "unread" : ""}`}>
    //     {lastMessage?.[0] === "notify" ? lastMessage?.[1] : message}
    //   </div>
    //   {!isRead && <div className="NotificationCircle"></div>}
    // </>
  );
}

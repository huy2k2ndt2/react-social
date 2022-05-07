import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Avatar from "../avatar/Avatar";

export default function Conversation({ conversation }) {
  const { _id: id, friend: friendContact, reads, members } = conversation;
  const [message, setMessage] = useState("");
  const [isRead, setIsRead] = useState(true);
  const [lastMessage, setLastMessage] = useState(
    () => conversation.lastMessage || ""
  );

  const { userCurrent } = useSelector((state) => state.auth);
  const { lastMessageConversation, statusConversations } = useSelector(
    (state) => state.chat
  );

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

  useEffect(() => {
    if (!lastMessage) return;
    const { isNotify, senderId, notify, text } = lastMessage;

    if (isNotify) {
      let message;
      if (senderId) {
        const { userName } = friendContact;

        message =
          userCurrent?._id === senderId
            ? `${userName} missed your call`
            : `You missed the call with ${userName}`;
      } else {
        message = notify[0];
      }
      return setMessage(message);
    }
    const data = senderId === userCurrent?._id ? "You" : handleGetName();

    setMessage(data + ": " + text);
  }, [lastMessage]);

  const handleGetName = () => {
    const data = friendContact?.userName.split(" ");
    const length = data.length;

    if (!data || !length) {
      return friendContact?.userName || "";
    }

    return data[length - 1];
  };

  return (
    <>
      <div className="pic banner">
        <Avatar user={friendContact} width="64px" height="64px" link={false} />
      </div>

      <div className={`name ${!isRead ? "unread" : ""}`}>
        {friendContact?.userName}
      </div>
      <div className={`message ${!isRead ? "unread" : ""}`}>
        {lastMessage?.[0] === "notify" ? lastMessage?.[1] : message}
      </div>
      {!isRead && <div className="NotificationCircle"></div>}
    </>
  );
}

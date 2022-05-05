import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Avatar from "../avatar/Avatar";

export default function Conversation({ conversation }) {
  const {
    _id: id,
    friend: friendContact,
    lastMessage,
    reads,
    members,
  } = conversation;
  const [message, setMessage] = useState("");
  const [isRead, setIsRead] = useState(true);

  const { userCurrent } = useSelector((state) => state.auth);
  const { lastMessageConversation, statusConversations } = useSelector(
    (state) => state.chat
  );
  const { usersOnline } = useSelector((state) => state.network);

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

    const data =
      lastMessageConversation?.senderId === userCurrent?._id
        ? "You"
        : handleGetName();

    setMessage(data + ": " + lastMessageConversation.message);
  }, [lastMessageConversation]);

  useEffect(() => {
    if (!lastMessage || !lastMessage.length) return;

    const data = lastMessage[0] === userCurrent?._id ? "You" : handleGetName();

    setMessage(data + ": " + lastMessage[1]);
  }, [lastMessage]);

  const handleGetName = (name) => {
    const data = friendContact?.userName.split(" ");
    const length = data.length;

    if (!data || !length) {
      return friendContact?.userName || "";
    }

    return data[length - 1];
  };

  handleGetName();

  return (
    <>
      <div className="pic banner">
        <Avatar user={friendContact} width="64px" height="64px" link={false} />
      </div>

      <div className={`name ${!isRead ? "unread" : ""}`}>
        {friendContact?.userName}
      </div>
      <div className={`message ${!isRead ? "unread" : ""}`}>{message}</div>
      {!isRead && <div className="NotificationCircle"></div>}
    </>
  );
}

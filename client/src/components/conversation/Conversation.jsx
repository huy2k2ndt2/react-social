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
    // if (lastMessage?.[0] === "notify") return;

    if (
      !lastMessageConversation ||
      lastMessageConversation?.conversationId !== id
    )
      return;

    if (lastMessageConversation.notify) {
      return setMessage(lastMessageConversation.notify);
    }

    const data =
      lastMessageConversation?.senderId === userCurrent?._id
        ? "You"
        : handleGetName();

    setMessage(data + ": " + lastMessageConversation.text);
  }, [lastMessageConversation]);

  useEffect(() => {
    if (!lastMessage || !lastMessage.length) return;

    const data = lastMessage[0] === userCurrent?._id ? "You" : handleGetName();

    setMessage(data + ": " + lastMessage[1]);
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

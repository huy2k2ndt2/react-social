import { useEffect, useState } from "react";
import "./chatOnline.css";
import { getDataAPI } from "../../api/fetchData";
import { useSelector } from "react-redux";
import useFormatTime from "../../hooks/useFormatTime";
import Avatar from "../avatar/Avatar";

export default function ChatOnline({
  conversationList,
  currentId,
  setCurrentChat,
}) {
  const [friendsNotContact, setFriendsNotContact] = useState([]);
  const { usersOnline } = useSelector((state) => state.network);
  const {
    userCurrent: { followings },
  } = useSelector((state) => state.auth);

  const time = useFormatTime(friend);

  useEffect(() => {
    if (friendsNotContact.length) {
      setFriendsNotContact((prev) =>
        prev.map((friend) =>
          usersOnline?.includes(friend?._id)
            ? {
                ...friend,
                online: true,
              }
            : {
                ...friend,
                online: false,
              }
        )
      );
    }
  }, [usersOnline]);

  useEffect(() => {
    let isMount = true;

    const getFriendsNotContact = async () => {
      const data = followings.filter((friend) => {
        return conversationList.every(
          (conversation) => !conversation.members.includes(friend)
        );
      });

      if (currentId) {
        try {
          const responses = await Promise.all(
            data.map((friendId) => getDataAPI("/user?userId=" + friendId))
          );

          const friends = [];
          responses.forEach((res) => {
            const { user } = res;
            usersOnline.includes(user?._id)
              ? (user.online = true)
              : (user.online = false);
            friends.push(user);
          });

          // toast.success("Get friend not contact success", { autoClose: 2000 });
          if (isMount) {
            setFriendsNotContact(friends);
          }
        } catch (err) {
          console.log("err", err);
        }
      }
    };

    getFriendsNotContact();

    return () => (isMount = false);
  }, [conversationList, followings]);

  const handleSetConversationChat = async ({ _id: friendId }) => {
    try {
      const response = await getDataAPI(`conversation/${friendId}`);

      const { message, conversation } = response;
      // toast.success(message, { autoClose: 2000 });
      setCurrentChat(conversation);
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <div className="chatOnline">
      <h3 className="chatOnlineTitle">Try starting a conversation with them</h3>

      {friendsNotContact.map((friend) => (
        <div
          key={friend._id}
          className="chatOnlineFriend"
          onClick={() => handleSetConversationChat(friend)}
        >
          <div className="chatOnlineImgContainer">
            <Avatar user={friend} link={false} />
          </div>
          <span className="chatOnlineName">{friend?.userName}</span>
        </div>
      ))}
    </div>
  );
}

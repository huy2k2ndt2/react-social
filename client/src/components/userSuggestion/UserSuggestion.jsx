import "./userSuggestion.css";
import { NO_AVATAR } from "../../contants/imgContant";
import { Link } from "react-router-dom";

export default function UserSuggestion({ user }) {
  return (
    <Link
      to={"/profile/" + user?._id}
      style={{
        textDecoration: "none",
        color: "#333",
      }}
    >
      <li className="sidebarFriend">
        <img
          className="sidebarFriendImg"
          src={
            user?.profilePicture?.length &&
            user?.profilePicture[0]  ||
            NO_AVATAR
          }
          alt=""
        />
        <span className="sidebarFriendName">{user.userName}</span>
      </li>
    </Link>
  );
}

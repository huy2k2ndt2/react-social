import "./sidebar.css";
import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
  School,
} from "@material-ui/icons";
import UserSuggestion from "../userSuggestion/UserSuggestion";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDataAPI } from "../../api/fetchData";
import { SET_CHAT } from "../../redux/actions";

export default function Sidebar() {
  const [usersSuggestion, setUsersSuggestion] = useState([]);

  const { userCurrent } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    let isMount = true;

    const getUsersSuggestion = async () => {
      if (userCurrent?._id) {
        try {
          const response = await getDataAPI(
            `/user/get-users-suggestion/${userCurrent?._id}`
          );

          const { message, users } = response;

          // toast.success(message, { autoClose: 2000 });
          if (isMount) {
            setUsersSuggestion(users);
          }
        } catch (err) {
          console.log("err", err);
        }
      }
    };
    getUsersSuggestion();

    return () => (isMount = false);
  }, [userCurrent]);

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem">
            <Chat className="sidebarIcon" />
            <span
              className="sidebarListItemText"
              onClick={() =>
                dispatch({
                  type: SET_CHAT,
                  payload: true,
                })
              }
            >
              Chats
            </span>
          </li>
          <li className="sidebarListItem">
            <PlayCircleFilledOutlined className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
            <Bookmark className="sidebarIcon" />
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <HelpOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Questions</span>
          </li>
          <li className="sidebarListItem">
            <WorkOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Jobs</span>
          </li>
          <li className="sidebarListItem">
            <Event className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
            <School className="sidebarIcon" />
            <span className="sidebarListItemText">Courses</span>
          </li>
        </ul>
        <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" />
        <ul className="sidebarUsersSuggestion">
          <h3 className="sidebarDesc">Recommend friends</h3>
          {usersSuggestion.map((user) => (
            <UserSuggestion key={user?._id} user={user} />
          ))}
        </ul>
      </div>
    </div>
  );
}

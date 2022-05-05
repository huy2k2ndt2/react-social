import "./topbar.scss";
import { Search, Person } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { debounce } from "../../helpers/debounceFunction";
import { getDataAPI } from "../../api/fetchData";
import Avatar from "../avatar/Avatar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_STATUS_CONVERSATION,
  INCREASE_NUMBER_FRIEND_REQUEST,
  SET_NUMBER_FRIEND_REQUEST,
  USER_LOGOUT,
  RESET_NETWORK,
  SET_PEER,
} from "../../redux/actions";
import BoxFriendRequests from "./BoxFriendRequests";
import IconMessage from "./IconMessage";
import IconNotifycation from "./IconNotifycation";

export default function Topbar() {
  const [notifications, setNotifications] = useState([]);
  const [isShowNotification, setIsShowNotification] = useState(false);
  const [firstShowNotification, setFirstShowNotification] = useState(false);
  const [usersSearch, setUsersSearch] = useState();
  const [isShowUsersSearch, setIsShowUsersSearch] = useState(false);
  const [isShowFriendRequests, setIsShowFriendRequests] = useState(false);

  const { socket } = useSelector((state) => state.network);
  const { userCurrent } = useSelector((state) => state.auth);
  const { isChat, statusConversations } = useSelector((state) => state.chat);
  const { number: numberFriendRequest } = useSelector(
    (state) => state.friendRequest
  );

  const searchInputRef = useRef();
  const displayUsersSearchRef = useRef();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    let isMount = true;

    const getNumberFriendRequest = async () => {
      try {
        const response = await getDataAPI(`/friend-request/get-number`);

        const { message, number } = response;

        if (isMount) {
          dispatch({
            type: SET_NUMBER_FRIEND_REQUEST,
            payload: number,
          });
        }
      } catch (err) {
        console.log("err", err);
      }
    };

    getNumberFriendRequest();

    return () => (isMount = false);
  }, []);

  useEffect(() => {
    const updateNumberFriendRequest = () => {
      dispatch({
        type: INCREASE_NUMBER_FRIEND_REQUEST,
      });
    };

    if (socket) {
      socket.on("updateNotification", updateNumberFriendRequest);
    }

    return () => socket?.off("updateNotification", updateNumberFriendRequest);
  }, [socket]);

  useEffect(() => {
    const handleCloseSearchUsers = (e) => {
      if (
        e.target !== displayUsersSearchRef.current &&
        e.target !== searchInputRef.current
      ) {
        setIsShowUsersSearch(false);
      }
    };
    document.body.addEventListener("click", handleCloseSearchUsers);

    return () => {
      document.body.removeEventListener("click", handleCloseSearchUsers);
    };
  }, [displayUsersSearchRef?.current]);

  useEffect(() => {
    let isMount = true;

    const handleUpdateNotification = ({ notification }) => {
      if (isMount) {
        setNotifications((prev) => [notification, ...prev]);
        setFirstShowNotification(false);
      }
    };

    if (socket) {
      socket.on("updateNotification", handleUpdateNotification);
    }

    return () => {
      isMount = false;
      socket?.off("updateNotification", handleUpdateNotification);
    };
  }, [socket]);

  useEffect(() => {
    let isMount = true;

    const getNumberConversationUnWatch = async () => {
      if (userCurrent) {
        try {
          const response = await getDataAPI(
            `/conversation/get-status-conversation`
          );

          const { message, conversations } = response;

          dispatch({
            type: SET_STATUS_CONVERSATION,
            payload: conversations,
          });
        } catch (err) {
          console.log("err", err);
        }
      }
    };
    getNumberConversationUnWatch();

    return () => (isMount = false);
  }, [userCurrent]);

  const handleSearchUsers = async () => {
    if (!searchInputRef?.current?.value) {
      return;
    }

    try {
      const response = await getDataAPI(
        `/user/search-user/${searchInputRef.current.value}`
      );

      const { message, users } = response;

      toast.success(message, { autoClose: 1000 });

      if (users.length) {
        setIsShowUsersSearch(true);
        setUsersSearch(users);
      }

      toast.success(message, { autoClose: 1000 });
    } catch (err) {
      console.log("err", err);
    }
  };

  const logOut = () => {
    dispatch({
      type: USER_LOGOUT,
    });
    dispatch({
      type: RESET_NETWORK,
    });
    dispatch({
      type: SET_PEER,
      payload: null,
    });

    localStorage.setItem("refresh-token", "");
    localStorage.setItem("access-token", "");

    localStorage.setItem("userId", "");

    socket?.emit("userLogOut", userCurrent?._id);
    navigate("/login");
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Lamasocial</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            ref={searchInputRef}
            placeholder="Search for friend, post or video"
            className="searchInput"
            onFocus={() => {
              if (!isShowUsersSearch) setIsShowUsersSearch(true);
            }}
            onChange={debounce(handleSearchUsers, 2000)}
          />

          {usersSearch && isShowUsersSearch && (
            <div className="displayUsersSearch" ref={displayUsersSearchRef}>
              {usersSearch.map((user) => (
                <div
                  className="userSearchContainer"
                  key={user?._id}
                  onClick={() => navigate(`/profile/${user?._id}`)}
                >
                  <Avatar user={user} />
                  <span>{user?.userName}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person onClick={() => setIsShowFriendRequests((prev) => !prev)} />
            {isShowFriendRequests && <BoxFriendRequests />}
            <span className="topbarIconBadge">{numberFriendRequest}</span>
          </div>
          <div className="topbarIconItem">
            <IconMessage />
          </div>
          <div className="topbarIconItem">
            <IconNotifycation />
          </div>
        </div>
        <div onClick={logOut} className="logout">
          <i className="fa-solid fa-right-from-bracket topbarImg"></i>
        </div>
      </div>
    </div>
  );
}

import "./rightbar.css";
import Friend from "../friend/Friend";
import { useEffect, useState } from "react";
import { STORE_IMG, NO_AVATAR } from "../../contants/imgContant";
import { Link } from "react-router-dom";
import { Add, Remove } from "@material-ui/icons";
import { getDataAPI, putDataAPI } from "../../api/fetchData";
import { useDispatch, useSelector } from "react-redux";
import { UN_FOLLOW, FOLLOW } from "../../redux/actions";
import { toast } from "react-toastify";
import moment from "moment";

export default function Rightbar({ user }) {
  const [friendList, setFriendList] = useState([]);

  const { userCurrent } = useSelector((state) => state.auth);
  const { usersOnline } = useSelector((state) => state.network);
  const dispatch = useDispatch();

  const [followed, setFollowed] = useState(() =>
    userCurrent?.followings.includes(user?._id)
  );

  const { socket } = useSelector((state) => state.network);

  useEffect(() => {
    let isMount = true;

    if (!socket) return;

    const updateFriendList = ({ userDisconnectId, time }) => {
      if(!isMount) return;
      setFriendList((prev) =>
        prev.map((friend) =>
          friend?._id === userDisconnectId
            ? {
                ...friend,
                lastLogin: time,
              }
            : friend
        )
      );
    };

    socket.on("friendLogout", updateFriendList);

    return () => {
      isMount = false;
      socket?.off("friendLogout", updateFriendList);
    };
  }, [socket]);

  useEffect(() => {
    if (friendList.length) {
      setFriendList((prev) =>
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
    setFollowed(userCurrent?.followings.includes(user?._id));
  }, [userCurrent?.followings, user?._id]);

  useEffect(() => {
    let isMount = true;

    const handleFetchFriends = async () => {
      if ((user && user._id) || (userCurrent && userCurrent._id)) {
        try {
          const response = await getDataAPI(
            `/user/get-friends/${user?._id || userCurrent?._id}`
          );

          const { message, friends } = response;
          // toast.success(message, { autoClose: 2000 });
          const friendsUpdateStatus = friends.map((friend) =>
            usersOnline?.includes(friend._id)
              ? {
                  ...friend,
                  online: true,
                }
              : {
                  ...friend,
                  online: false,
                }
          );
          if (isMount) {
            setFriendList(friendsUpdateStatus);
          }
        } catch (err) {
          console.log("err", err);
        }
      }
    };
    handleFetchFriends();

    return () => (isMount = false);
  }, [user, userCurrent]);

  const handleClick = async () => {
    if (user?._id) {
      try {
        let response;
        if (followed) {
          response = await putDataAPI(`/user/unfollow/${user._id}`, {
            userId: userCurrent._id,
          });

          dispatch({
            type: UN_FOLLOW,
            payload: user._id,
          });
        } else {
          response = await putDataAPI(`/user/follow/${user._id}`, {
            userId: userCurrent._id,
          });
          dispatch({
            type: FOLLOW,
            payload: user._id,
          });
        }

        const { message } = response;
        toast.success(message, { autoClose: 2000 });
        setFollowed(!followed);
      } catch (err) {
        console.log("err", err);
      }
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src={STORE_IMG + "gift.png"} alt="" />
          <span className="birthdayText"></span>
        </div>
        <img className="rightbarAd" src={STORE_IMG + "ad.png"} alt="" />
        <h4 className="rightbarTitle">Friends</h4>
        <ul className="rightbarFriendList">
          {friendList.map((friend) => (
            <Friend key={friend?._id} friend={friend} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user?.userName !== userCurrent?.userName && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user?.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user?.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user?.relationships === 1
                ? "Single"
                : user?.relationships === 2
                ? "Marry"
                : "In a complicated relationship"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friendList.map((friend) => (
            <div key={friend._id} className="rightbarFollowing">
              <Link to={`/profile/${friend?._id}`}>
                <img
                  src={
                    (friend?.profilePicture?.length &&
                      friend?.profilePicture[0]) ||
                    NO_AVATAR
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
              </Link>
              <div
                className={`active ${friend?.online ? "online" : "offline"} `}
              >
                8 hours
              </div>
              {/* <TimeOffline /> */}
              <span className="rightbarFollowingName">{friend?.userName}</span>
            </div>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}

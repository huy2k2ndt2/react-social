import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDataAPI } from "../../api/fetchData";
import { SET_FRIEND_INVITES } from "../../redux/actions";
import CardFriend from "./CardFriend";

const InviteFriend = () => {
  const { userCall, isAnswer, fristLoadFriends, friendInvites } = useSelector(
    (state) => state.call
  );

  const { userCurrent } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    let isMount = true;

    const handleFetchFriends = async () => {
      if (userCurrent && userCurrent._id) {
        try {
          const response = await getDataAPI(
            `/user/get-friends/${userCurrent?._id}`
          );

          const { message, friends } = response;
          // toast.success(message, { autoClose: 2000 });

          let data = [...friends];

          if (userCall) {
            data = friends.filter((friend) => friend?._id !== userCall._id);
          }

          if (isMount) {
            dispatch({
              type: SET_FRIEND_INVITES,
              payload: data,
            });
          }
        } catch (err) {
          console.log("err", err);
        }
      }
    };
    //isAnswer && fristLoadFriends
    if (fristLoadFriends) {
      handleFetchFriends();
    }

    return () => (isMount = false);
  }, [userCurrent, isAnswer]);

  return (
    <div className="invite">
      <p>Invite More People</p>
      <div className="invite_content">
        {friendInvites &&
          friendInvites.map((friend) => (
            <div className="friend_invite" key={friend?._id}>
              <CardFriend friend={friend} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default InviteFriend;

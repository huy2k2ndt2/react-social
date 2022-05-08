import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDataAPI } from "../../api/fetchData";
import { SET_FRIEND_INVITES } from "../../redux/actions";
import CardFriend from "./CardFriend";
import Carousel from "../Carousel/Carousel";
import "./InviteFriend.scss";
import Slider from "react-slick";

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

  const settings = useMemo(() => ({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  }));

  const body = (className) =>
    friendInvites.map((friend) => (
      <div key={friend?._id}>
        <div className={"friend_invite " + className}>
          <CardFriend friend={friend} />
        </div>
      </div>
    ));

  return (
    <div className="invite">
      <p className="title">Invite More People</p>

      {friendInvites.length <= 3 ? (
        <div className="invite_content">{body("no-slider")}</div>
      ) : (
        <Slider {...settings}>{body()}</Slider>
      )}

      {/* <Carousel>
        {friendInvites.map((friend) => (
          <div key={friend?._id}>
            <div className="friend_invite">
            <CardFriend friend={friend} />
            </div>
          </div>
        ))}
      </Carousel> */}
    </div>
  );
};

export default InviteFriend;

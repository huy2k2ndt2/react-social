import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDataAPI } from "../../api/fetchData";
import { NO_AVATAR } from "../../contants/imgContant";
import "./displayFriendList.scss";
import Carousel from "../../components/Carousel/Carousel";

const DisplayFriendList = () => {
  const [friendList, setFriendList] = useState([]);

  const { userCurrent } = useSelector((state) => state.auth);
  const { userProfile } = useSelector((state) => state.profile);

  useEffect(() => {
    let isMount = true;

    const handleFetchFriends = async () => {
      if (userProfile && userProfile._id) {
        try {
          const response = await getDataAPI(
            `/user/get-friends/${userProfile?._id}`
          );

          const { message, friends } = response;
          // toast.success(message, { autoClose: 2000 });

          if (isMount) {
            setFriendList(friends);
          }
        } catch (err) {
          console.log("err", err);
        }
      }
    };
    handleFetchFriends();

    return () => (isMount = false);
  }, [userProfile?._id, userCurrent]);

  return (
    <div className="row friend-container">
      <Carousel>
        {friendList.map((friend) => (
          <div key={friend?._id} >
            <div className="our-friend">
              <div className="picture">
                <img
                  className="img-fluid"
                  src={
                    (friend?.profilePicture?.length &&
                      friend?.profilePicture[0]) ||
                    NO_AVATAR
                  }
                />
              </div>
              <div className="friend-content">
                <p className="name">{friend?.userName}</p>
                <h4 className="title">{friend?.desc}</h4>
              </div>
              <ul className="social">
                <li>
                  <i className="fa-brands fa-facebook-square"></i>
                </li>
                <li>
                  <i className="fa-brands fa-twitter-square"></i>
                </li>
                <li>
                  <i className="fa-brands fa-youtube-square"></i>
                </li>
                <li>
                  <i className="fa-brands fa-github-square"></i>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default DisplayFriendList;

import React from "react";
import { useSelector } from "react-redux";
import Avatar from "../../components/avatar/Avatar";
import ButtonSocials from "../../components/buttonSocials/ButtonSocials";
import UpdateImage from "../../components/UpdateImage/UpdateImage";

const ProfileLeft = ({ idAvatar }) => {
  const { userProfile } = useSelector((state) => state.profile);
  const { userCurrent } = useSelector((state) => state.auth);

  return (
    <div className="left col-lg-4">
      <div className="photo-left">
        <Avatar
          className="profile"
          width={"200px"}
          height={"200px"}
          user={userProfile}
          isShowOffline={false}
          link={false}
        />
        {userProfile?._id === userCurrent?._id && (
          <UpdateImage id={idAvatar.current} type="avatar" />
        )}
      </div>
      <h4 className="name">{userProfile?.userName}</h4>
      <p className="info">{userProfile?.email}</p>
      <div className="stats row">
        <div className="stat col-4">
          <p className="number-stat">{userProfile?.followers?.length}</p>
          <p className="desc-stat">Followers</p>
        </div>
        <div className="stat col-4">
          <p className="number-stat">{userProfile?.followings?.length}</p>
          <p className="desc-stat">Following</p>
        </div>
        <div className="stat col-4">
          <p className="number-stat">{userProfile?.friends?.length}</p>
          <p className="desc-stat">Friend</p>
        </div>
      </div>
      <p className="desc">{userProfile?.desc}</p>

      <ButtonSocials />
      {/* <div className="social"> */}
      {/* <i className="fa-brands fa-facebook-square"></i>
        <i className="fa-brands fa-twitter-square"></i>
        <i className="fa-brands fa-youtube-square"></i>
        <i className="fa-brands fa-github-square"></i> */}
      {/* </div> */}
    </div>
  );
};

export default ProfileLeft;

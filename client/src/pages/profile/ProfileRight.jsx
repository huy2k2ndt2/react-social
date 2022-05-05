import React, { useEffect, useState } from "react";
import AboutProfile from "./AboutProfile";
import DisplayFriendList from "./DisplayFriendList";
import NavProfile from "./NavProfile";
import ProfileButtonActions from "./ProfileButtonActions";

const ProfileRight = () => {
  const [option, setOption] = useState("friends");

  return (
    <div className="right col-lg-8">
      <ProfileButtonActions  />
      <NavProfile option={option} setOption={setOption} />
      <div className="display-content">
        {option === "about" && <AboutProfile />}
        {option === "friends" && <DisplayFriendList />}
      </div>
    </div>
  );
};

export default ProfileRight;

import React, { useState } from "react";
import EditProfile from "./EditProfile";
import DisplayDetailInfo from "./DisplayDetailInfo";

const AboutProfile = ({ user }) => {
  const [isEditInfo, setIsEditInfo] = useState(false);

  return (
    <>
      {!isEditInfo ? (
        <DisplayDetailInfo onEdit={setIsEditInfo} />
      ) : (
        <EditProfile onEdit={setIsEditInfo} />
      )}
    </>
  );
};

export default AboutProfile;

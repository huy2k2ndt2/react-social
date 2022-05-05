import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useCheckOnline = (user, isLog) => {
  const [isOnline, setIsOnline] = useState(false);

  const { usersOnline } = useSelector((state) => state.network);
  const { userCurrent } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userCurrent?._id === user?._id) return setIsOnline(true);
    if (usersOnline && usersOnline.length > 0) {
      return setIsOnline(usersOnline.includes(user?._id));
    }
    setIsOnline(false);
  }, [usersOnline, user, userCurrent]);

  return [isOnline, setIsOnline];
};

export default useCheckOnline;

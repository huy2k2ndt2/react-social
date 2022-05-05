import { useMemo } from "react";
import formatTime from "../helpers/formatTime";

const useFormatTime = (user, slice = true) => {
  const time = useMemo(() => {
    if (user?.lastLogin) return formatTime(user.lastLogin, slice);
  }, [user]);

  return time;
};

export default useFormatTime;

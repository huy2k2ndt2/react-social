import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { putDataAPI } from "../../api/fetchData";
import { FOLLOW, UN_FOLLOW } from "../../redux/actions";

const ButtonFollow = () => {
  const { userCurrent } = useSelector((state) => state.auth);
  const { userProfile } = useSelector((state) => state.profile);

  const [followed, setFollowed] = useState(
    () => userCurrent?.followings.includes(userProfile?._id) || false
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (userCurrent) {
      setFollowed(userCurrent?.followings.includes(userProfile?._id));
    }
  }, [userCurrent, userProfile]);

  const handleClick = async () => {
    if (userProfile?._id) {
      try {
        let response;
        if (followed) {
          response = await putDataAPI(`/user/unfollow/${userProfile._id}`, {
            userId: userCurrent._id,
          });

          dispatch({
            type: UN_FOLLOW,
            payload: userProfile._id,
          });
        } else {
          response = await putDataAPI(`/user/follow/${userProfile._id}`, {
            userId: userCurrent._id,
          });
          dispatch({
            type: FOLLOW,
            payload: userProfile._id,
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

  return (
    <button
      className="card__action__button card__action--follow"
      onClick={handleClick}
    >
      {followed ? "Unfollow" : "Follow"}
    </button>
  );
};

export default ButtonFollow;

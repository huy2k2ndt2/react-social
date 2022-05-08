import "./profile.scss";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import ProfileRight from "./ProfileRight";
import ProflieLeft from "./ProfileLeft";
import Rightbar from "../../components/rightbar/Rightbar";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { getDataAPI, patchDataAPI } from "../../api/fetchData";
import { useSelector, useDispatch } from "react-redux";
import UpdateImage from "../../components/UpdateImage/UpdateImage.jsx";
import { v4 as uuidv4 } from "uuid";
import ModalChooseImage from "../../components/modal/ModalChooseImage";
import {
  UPDATE_BACKGROUND_USER,
  UPDATE_AVATAR_USER,
  UPDATE_USER,
  SET_USER_PROFILE,
  SET_IS_ME,
} from "../../redux/actions";
import { imageUpload, removeImage } from "../../helpers/image";
import { NO_BACKGROUND } from "../../contants/imgContant";

export default function Profile() {
  const { id } = useParams();

  const { userCurrent } = useSelector((state) => state.auth);
  const { userProfile } = useSelector((state) => state.profile);
 

  const idBgc = useRef(uuidv4());
  const idAvatar = useRef(uuidv4());

  const dispatch = useDispatch();

  useEffect(() => {
    let isMount = true;
    if (userCurrent) {
      if (userCurrent?._id !== id) {
        const fetchUser = async () => {
          try {
            const response = await getDataAPI(`/user?userId=${id}`);

            const { user } = response;

            dispatch({
              type: SET_USER_PROFILE,
              payload: {
                userProfile: user,
                isFriend: user?.friends.includes(userCurrent?._id),
              },
            });
          } catch (err) {
            console.log("err", err);
          }
        };
        fetchUser();
      } else {
        if (isMount) {
          dispatch({
            type: SET_IS_ME,
            payload: userCurrent,
          });
        }
      }
    }

    return () => (isMount = false);
  }, [userCurrent, id]);

  const handleUpload = async (files, typeImage) => {
    if (!files.length) return;

    if (userProfile[typeImage]?.length) {
      removeImage([userProfile[typeImage][1]]);
    }

    const images = await imageUpload(files);

    const dataImage = [];
    for (const key in images[0]) {
      dataImage.push(images[0][key]);
    }

    const response = await patchDataAPI(`/user/update-user`, {
      [typeImage]: dataImage,
      userId: userProfile?._id,
    });

    dispatch({
      type:
        typeImage === "coverPicture"
          ? UPDATE_BACKGROUND_USER
          : UPDATE_AVATAR_USER,
      payload: dataImage,
    });
  };

  return (
    <>
      <Topbar />
      <div className="profile-container">
        <div
          className="profile-bgc"
          style={{
            backgroundImage: `url(${
              (userProfile?.coverPicture?.length &&
                userProfile?.coverPicture[0]) ||
              NO_BACKGROUND
            })`,
          }}
        >
          <i className="fa fa-bars" aria-hidden="true"></i>

          {userProfile?._id === userCurrent?._id && (
            <UpdateImage
              id={idBgc.current}
              text={`${
                userProfile?.coverPicture?.length &&
                userProfile?.coverPicture[0]
                  ? "Change"
                  : "Add"
              } cover photo`}
              type="background"
            />
          )}
        </div>
        {/* <hr className="separator" /> */}

        <hr className="separator separator--line" />

        {/* <hr className="separator separator--dots" /> */}

        {/* <hr className="separator separator--dotter" /> */}
        <main>
          <div className="row">
            <ProflieLeft idAvatar={idAvatar} />
            <ProfileRight />
          </div>
        </main>
      </div>

      <ModalChooseImage
        onSave={handleUpload}
        width={"100%"}
        multiple={false}
        height={"300px"}
        id={idBgc.current}
        text={"Select the background image you want to update"}
        typeImage="coverPicture"
      />

      <ModalChooseImage
        onSave={handleUpload}
        multiple={false}
        width={"100%"}
        height={"250px"}
        id={idAvatar.current}
        text={"Select the avatar image you want to update"}
        typeImage="profilePicture"
      />
    </>
  );
}

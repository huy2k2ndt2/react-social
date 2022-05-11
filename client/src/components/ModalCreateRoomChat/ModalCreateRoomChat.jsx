import React, { useEffect, useRef, useState } from "react";
import "./ModalCreateRoomChat.scss";
import { NO_AVATAR } from "../../contants/imgContant";
import {
  ADD_CONVERSATION,
  ADD_FRIEND_TO_ROOM,
  REMOVE_FRIEND_TO_ROOM,
  RESET_CREATE_ROOM,
  SET_LIST_FRIEND,
} from "../../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import { getDataAPI, postDataAPI } from "../../api/fetchData";
import Avatar from "../avatar/Avatar";
import { imageUpload } from "../../helpers/image";
import { toast } from "react-toastify";

const ModalCreateRoomChat = () => {
  const [file, setFile] = useState();

  const nameRef = useRef("");
  const descRef = useRef("");

  const { userCurrent } = useSelector((state) => state.auth);
  const { friends, friendAdds } = useSelector((state) => state.createRoomChat);

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

          if (isMount) {
            dispatch({
              type: SET_LIST_FRIEND,
              payload: friends,
            });
          }
        } catch (err) {
          console.log("err", err);
        }
      }
    };

    handleFetchFriends();

    return () => (isMount = false);
  }, [userCurrent]);

  const handleCloseModal = () =>
    dispatch({
      type: RESET_CREATE_ROOM,
    });

  const handleSubmit = async () => {
    const data = {};

    if (!nameRef.current.value) {
      return toast.info(`Please enter name room chat`, { autoClose: 500 });
    }

    if (!friendAdds.length) {
      return toast.info(`Please add members to room chat`, { autoClose: 500 });
    }

    data.members = [
      userCurrent?._id,
      ...friendAdds.map((friend) => friend?._id),
    ];

    if (file) {
      const images = await imageUpload([file]);
      data.image = [];
      for (const key in images[0]) {
        data.image.push(images[0][key]);
      }
    }

    data.name = nameRef.current.value;
    data.desc = descRef.current.value;

    data.reads = [userCurrent?._id, ...friendAdds.map((friend) => friend?._id)];
    data.status = [userCurrent?._id];
    data.isMultiple = true;

    const { conversation } = await postDataAPI("/conversation", data);

    dispatch({
      type: ADD_CONVERSATION,
      payload: { conversation },
    });

    handleCloseModal();
  };

  return (
    <div className="create_room_modal">
      <div className="container">
        <h3 className="title">Create New Room Chat</h3>

        <div className="content">
          <div className="content-left">
            <h4>Add friends to the room</h4>

            {/* List friend */}

            <div className="list_friend">
              {friends.map((friend) => (
                <div className="friend" key={friend?._id}>
                  <div className="friend-info">
                    <Avatar user={friend} link={false} isStatus={false} />
                    <p className="friend-name">{friend?.userName}</p>
                  </div>
                  <div className="button-actions">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() =>
                        dispatch({
                          type: ADD_FRIEND_TO_ROOM,
                          payload: friend,
                        })
                      }
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="content-right">
            <h4>Room information you want to create</h4>

            <div className="form-group">
              <label htmlFor="name-room">Name Room</label>
              <input
                ref={nameRef}
                type="text"
                className="form-control"
                id="name-room"
                placeholder="abc"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="desc-room">Description</label>
              <input
                ref={descRef}
                type="text"
                className="form-control"
                id="desc-room"
                placeholder="abc"
              />
            </div>

            <div className="custom-file">
              <input
                onChange={(e) => setFile(e.target.files[0])}
                type="file"
                className="custom-file-input"
                id="validatedCustomFile"
              />
              <label
                className="custom-file-label"
                htmlFor="validatedCustomFile"
              >
                Choose Avatar...
              </label>
            </div>

            <div className="display_room_avatar">
              {file && <img src={URL.createObjectURL(file)} alt="" />}
            </div>

            {friendAdds.length > 0 && (
              <>
                <h5 className="members mt-4">members</h5>
                <div className="list_friend">
                  {friendAdds.map((friend) => (
                    <div className="friend" key={friend?._id}>
                      <div className="friend-info">
                        <Avatar user={friend} link={false} isStatus={false} />
                        <p className="friend-name">{friend?.userName}</p>
                      </div>
                      <div className="button-actions">
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={() =>
                            dispatch({
                              type: REMOVE_FRIEND_TO_ROOM,
                              payload: friend,
                            })
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="footer">
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleCloseModal}
          >
            Cancel
          </button>
          <button type="button" className="btn btn-info" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateRoomChat;

import "./editProfile.scss";

import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { toast } from "react-toastify";
import { patchDataAPI } from "../../api/fetchData";
import { UPDATE_USER } from "../../redux/actions";

const EditProfile = ({ onEdit }) => {
  const { userCurrent } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const nameRef = useRef();
  const phoneRef = useRef();
  const addressRef = useRef();
  const descRef = useRef();
  const relationshipRef = useRef();

  const updateUser = async (e) => {
    e.preventDefault();

    if (!nameRef.current.value) {
      return toast.error("This field cannot be left blank", {
        autoClose: 1000,
      });
    }

    try {
      const data = {
        userName: nameRef.current.value,
        phone: phoneRef.current.value,
        address: addressRef.current.value,
        relationship: relationshipRef.current.value,
        desc: descRef.current.value,
        userId: userCurrent?._id,
      };

      const response = await patchDataAPI("/user/update-user", data);

      const { message, user: userUpdate } = response;

      dispatch({
        type: UPDATE_USER,
        payload: userUpdate,
      });

      onEdit(false);
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <form className="edit-profile" onSubmit={updateUser}>
      <div className="page">
        <label className="field field_v1">
          <input
            defaultValue={userCurrent?.userName || ""}
            ref={nameRef}
            className="field__input"
            placeholder="e.g Coder Noob"
          />
          <span className="field__label-wrap">
            <span className="field__label">Full name</span>
          </span>
        </label>
        <label className="field field_v2">
          <input
            defaultValue={userCurrent?.email}
            className="field__input"
            placeholder="abc@gmail.com"
            disabled
          />
          <span className="field__label-wrap">
            <span className="field__label">Email</span>
          </span>
        </label>
        <label className="field field_v3">
          <input
            defaultValue={userCurrent?.address || ""}
            ref={addressRef}
            className="field__input"
            placeholder="e.g Nam Dinh, Viet Nam"
          />
          <span className="field__label-wrap">
            <span className="field__label">Address</span>
          </span>
        </label>
        <label className="field field_v2">
          <input
            defaultValue={userCurrent?.phone || ""}
            ref={phoneRef}
            className="field__input"
            placeholder="e.g (+84) 0399738474"
          />
          <span className="field__label-wrap">
            <span className="field__label">Phone</span>
          </span>
        </label>
        <label className="field field_v3">
          <input
            defaultValue={userCurrent?.desc || ""}
            ref={descRef}
            className="field__input"
            placeholder="Fill in what you like"
          />
          <span className="field__label-wrap">
            <span className="field__label">Description</span>
          </span>
        </label>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <label className="input-group-text" htmlFor="inputGroupSelect01">
              Relationship
            </label>
          </div>
          <select
            ref={relationshipRef}
            className="custom-select"
            id="inputGroupSelect01"
          >
            <option value="" selected>
              Choose...
            </option>
            <option value="Single">Single</option>
            <option value="Get married">Get married</option>
            <option value="Dating">Dating</option>
            <option value="In a complicated relationship">
              In a complicated relationship
            </option>
          </select>
        </div>
      </div>
      <div className="linktr">
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onEdit(false)}
        >
          Cancel
        </button>
        <button className="btn btn-primary" type="submit">
          Save
        </button>
      </div>
    </form>
  );
};

export default EditProfile;

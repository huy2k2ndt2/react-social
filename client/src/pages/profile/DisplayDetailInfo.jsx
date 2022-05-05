import React from "react";
import { useSelector } from "react-redux";

const DisplayDetailInfo = ({ onEdit }) => {
  const { userCurrent } = useSelector((state) => state.auth);
  const { userProfile } = useSelector((state) => state.profile);

  return (
    <div className="col-12">
      <div className="card mb-3">
        <div className="card-body">
          <div className="row">
            <div className="col-sm-3">
              <h6 className="mb-0">Full Name</h6>
            </div>

            <div className="col-sm-9 text-secondary">
              {userProfile?.userName}
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-sm-3">
              <h6 className="mb-0">Email</h6>
            </div>

            <div className="col-sm-9 text-secondary">{userProfile?.email}</div>
          </div>
          <hr />
          <div className="row">
            <div className="col-sm-3">
              <h6 className="mb-0">Phone</h6>
            </div>

            <div className="col-sm-9 text-secondary">
              {userProfile?.phone
                ? userProfile?.phone
                : "Not updated information"}
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-sm-3">
              <h6 className="mb-0">Relationship</h6>
            </div>
            <div className="col-sm-9 text-secondary">
              {userProfile?.relationship
                ? userProfile?.relationship
                : "Not updated information"}
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-sm-3">
              <h6 className="mb-0">Address</h6>
            </div>

            <div className="col-sm-9 text-secondary">
              {userProfile?.address
                ? userProfile?.address
                : "Not updated information"}
            </div>
          </div>
          <hr />

          {userProfile?._id === userCurrent?._id && (
            <div className="row">
              <div className="col-12">
                <button className="btn btn-info" onClick={() => onEdit(true)}>
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayDetailInfo;

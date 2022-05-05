import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getDataAPI } from "../../../api/fetchData";
import { UPDATE_USER } from "../../../redux/actions";

function ProtectLayOut({ children }) {
  const [isLogin, setIslogin] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    const userId = localStorage.getItem("userId")
      ? JSON.parse(localStorage.getItem("userId"))
      : "";

    if (userId) {
      const handleGetUser = async () => {
        try {
          const response = await getDataAPI(`/user?userId=${userId}`);

          const { message, user } = response;

          dispatch({
            type: UPDATE_USER,
            payload: user,
          });
        } catch (err) {
          console.log("err", err);
          navigate("/login");
        }
      };

      handleGetUser();
      setIslogin(true);
    } else navigate("/login");
  }, []);

  return isLogin ? <>{children}</> : <></>;
}

export default ProtectLayOut;

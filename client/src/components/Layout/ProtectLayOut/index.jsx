import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getDataAPI } from "../../../api/fetchData";
import { UPDATE_USER } from "../../../redux/actions";
import jwt_decode from "jwt-decode";

function ProtectLayOut({ children }) {
  const [isLogin, setIslogin] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem("access-token")
      ? JSON.parse(localStorage.getItem("access-token"))
      : "";

    if (accessToken) {
      const { exp, userId } = jwt_decode(accessToken);
      const date = new Date();
      if (exp < date.getTime() / 1000 || !userId) {
        return navigate("/login");
      }

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

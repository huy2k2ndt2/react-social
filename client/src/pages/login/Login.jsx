import "./login.css";
import { useRef, useEffect } from "react";
import { login } from "../../api/authApi";
import { CircularProgress } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

export default function Login() {
  const userNameRef = useRef();
  const passwordRef = useRef();

  const navigate = useNavigate();

  // const { user, isLoading, error, dispatch } = useSelector((state) => state.network);
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.auth);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(
      login(
        {
          userName: userNameRef.current.value,
          password: passwordRef.current.value,
        },
        navigate
      )
    );
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Coder Noob</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on CODE NOOB.
          </span>
        </div>
        <form className="loginRight" onSubmit={handleLogin}>
          <div className="loginBox">
            <input
              required
              placeholder="User name"
              ref={userNameRef}
              type="text"
              className="loginInput"
            />
            <input
              required
              placeholder="Password"
              ref={passwordRef}
              type="password"
              className="loginInput"
              minLength="6"
            />
            <button className="loginButton">
              {isLoading ? (
                <CircularProgress color={"primary"} size="30px" />
              ) : (
                "Log In"
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button
              className="loginRegisterButton"
              onClick={() => navigate("/register")}
            >
              {isLoading ? (
                <CircularProgress color={"primary"} size="30px" />
              ) : (
                "Create a New Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

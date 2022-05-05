import "./register.css";
import { register } from "../../api/authApi";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { generateKeywords } from "../../helpers/createKeyUser";

export default function Register() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const userNameRef = useRef();
  const passwordAgainRef = useRef();

  const navigate = useNavigate();

  // const { user, isLoading, error, dispatch } = useSelector((state) => state.network);

  const handleRegister = (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== passwordAgainRef.current.value) {
      passwordAgainRef.current.setCustomValidity("Password don't match");
    } else {
      const keys = generateKeywords(userNameRef.current.value);

      register(
        {
          email: emailRef.current.value,
          password: passwordRef.current.value,
          userName: userNameRef.current.value,
          keys,
        },
        navigate
      );
    }
  };

  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">Lamasocial</h3>
          <span className="registerDesc">
            Connect with friends and the world around you on Lamasocial.
          </span>
        </div>
        <div className="registerRight">
          <form className="registerBox" onSubmit={handleRegister}>
            <input
              required
              ref={userNameRef}
              placeholder="Username"
              className="registerInput"
            />
            <input
              required
              ref={emailRef}
              placeholder="Email"
              type="email"
              className="registerInput"
            />
            <input
              type="password"
              minLength={"6"}
              required
              ref={passwordRef}
              placeholder="Password"
              className="registerInput"
            />
            <input
              type="password"
              minLength={"6"}
              required
              ref={passwordAgainRef}
              placeholder="Password Again"
              className="registerInput"
            />
            <button className="registerButton">Sign Up</button>
            <Link
              to={"/login"}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button className="registerRegisterButton">
                Log into Account
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

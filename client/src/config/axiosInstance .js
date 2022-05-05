import axios from "axios";
import { toast } from "react-toastify";

import jwt_decode from "jwt-decode";

const instance = axios.create({
  baseURL: "http://localhost:8080/v1/api",
  // withCredentials: true,
  // credentials: "include",
});

instance.interceptors.request.use(
  async (request) => {
    const date = new Date();
    let accessToken = localStorage.getItem("access-token")
      ? JSON.parse(localStorage.getItem("access-token"))
      : "";

    if (!accessToken) {
      throw new Error("Please login");
    }

    const { exp } = jwt_decode(accessToken);

    if (exp < date.getTime() / 1000) {
      // axios.defaults.withCredentials = true;
      // axios.defaults.credentials = "include";

      const refreshToken = JSON.parse(localStorage.getItem("refresh-token"));

      try {
        const response = await axios.post(
          "http://localhost:8080/v1/api/auth/refresh-token",
          {
            refreshToken,
          }
        );

        const { newAccessToken, newRefreshToken } = response.data;
        localStorage.setItem("refresh-token", JSON.stringify(newRefreshToken));
        localStorage.setItem("access-token", JSON.stringify(newAccessToken));

        accessToken = newAccessToken;
      } catch (err) {
        throw new Error("Refresh Token failed");
      }
    }

    request.headers["Authorization"] = "Bearer " + accessToken;
    return request;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    console.log("error", { error });
    const message = error?.response?.data?.message || error.message;

    toast.error(message, { autoClose: 1000 });
    return Promise.reject(message);
  }
);

export default instance;

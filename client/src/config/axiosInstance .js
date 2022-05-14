import axios from "axios";
import { toast } from "react-toastify";

import jwt_decode from "jwt-decode";

const instance = axios.create({
  baseURL: "http://localhost:8080/v1/api",
});

let refreshTokenRequest = null;
const handleRefreshToken = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/v1/api/auth/refresh-token",
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (err) {
    throw err;
  }
};

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
      try {
        refreshTokenRequest = refreshTokenRequest
          ? refreshTokenRequest
          : handleRefreshToken();

        const response = await refreshTokenRequest;

        const { newAccessToken } = response.data;

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

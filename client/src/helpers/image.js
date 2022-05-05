import cloudinary from "../config/cloudinary";
import axios from "axios";
import { NO_AVATAR } from "../contants/imgContant";

export const imageUpload = async (images) => {
  try {
    const responses = await Promise.all(
      images.map((image) => {
        const formData = new FormData();
        if (image.camera) {
          formData.append("file", image.url);
        } else formData.append("file", image);
        formData.append("upload_preset", "react-social");

        return axios.post(
          "https://api.cloudinary.com/v1_1/ko-c/image/upload",
          formData
        );
      })
    );
    return responses.map(({ data }) => {
      return {
        url: data.url,
        public_id: data.public_id,
      };
    });
  } catch (err) {
    throw err;
  }
};

export const removeImage = (images) => {
  try {
    images.map((image) =>
      cloudinary.uploader.destroy(image, (data, error) => {
        if (error) {
          throw error;
        }
      })
    );
  } catch (err) {
    throw err;
  }
};

export const displayAvatar = (user) => {
  return (user?.profilePicture?.length && user?.profilePicture[0]) || NO_AVATAR;
};
export const displayBgc = (user) => {
  return (user?.coverPicture?.length && user?.coverPicture[0]) || NO_AVATAR;
};

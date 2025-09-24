import axios from "axios";

export const uploadImage = async (img) => {
  try {
    const formData = new FormData();
    formData.append("image", img);

    const response = await axios.post(
      import.meta.env.VITE_SERVER_DOMAIN + "/upload-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.imageUrl;
  } catch (error) {
    throw error;
  }
};

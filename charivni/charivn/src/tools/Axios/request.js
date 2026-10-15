import axios from "axios";

export const request = async (url, method = "get", postData = "") => {
  if (method === "get") {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  } else if (method === "post") {
    try {
      const response = await axios.post(url, postData);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
};
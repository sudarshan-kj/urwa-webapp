import config from "../config";
import axios from "axios";

export const isAuthenticated = () => {
  if (
    localStorage.getItem("token") &&
    localStorage.getItem("token") !== "undefined"
  ) {
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.setItem("token", "undefined");
};

export const authAxios = () =>
  axios.create({
    baseURL: config.API_ENDPOINT,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

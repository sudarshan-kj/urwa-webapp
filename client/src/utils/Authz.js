import jwt_decode from "jwt-decode";
import { isAuthenticated } from "./Auth";

export const hasPermission = ({ adminOnly, permission }) => {
  if (isAuthenticated()) {
    const decodedToken = jwt_decode(localStorage.getItem("token"));
    const memberPermission = decodedToken.permissionLevel.split("-");
    const selfPermission = memberPermission[1];
    const adminPermission = memberPermission[0];
    if (adminOnly) {
      if (permission & adminPermission) {
        return true;
      }
    } else {
      if (permission & adminPermission) {
        return true;
      } else if (permission & selfPermission) {
        return true;
      }
    }
  }
  return false;
};

export const isAdmin = () => {
  if (isAuthenticated()) {
    const decodedToken = jwt_decode(localStorage.getItem("token"));
    const adminPermission = decodedToken.permissionLevel.split("-")[0];
    if (adminPermission > 0) {
      return true;
    }
  }
  return false;
};

export const permissions = {
  CREATE: "0x08",
  READ: "0x04",
  UPDATE: "0x02",
  DELETE: "0x01",
  ALL: "0x0F",
};

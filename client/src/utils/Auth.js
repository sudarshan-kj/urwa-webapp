exports.isAuthenticated = () => {
  if (
    localStorage.getItem("token") ||
    localStorage.getItem("token") !== "undefined"
  ) {
    return true;
  }
  return false;
};

exports.logout = () => {
  localStorage.setItem("token", "undefined");
};

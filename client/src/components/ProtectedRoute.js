import React from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/Auth";
import { Box, Button } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const WithLogoutHeader = ({ component: Component }) => {
  const history = useHistory();
  return (
    <>
      <Box pos="fixed" p={4} top={0} right={0}>
        <Button
          rightIcon={<ArrowForwardIcon />}
          colorScheme="teal"
          onClick={() => {
            logout();
            history.push("/login");
          }}
        >
          Logout
        </Button>
      </Box>
      <Component />
    </>
  );
};

const ProtectedRoute = ({ path, component }) => {
  return isAuthenticated() ? (
    <Route to={path}>
      <WithLogoutHeader component={component} />
    </Route>
  ) : (
    <Redirect to="/login" />
  );
};

export default ProtectedRoute;

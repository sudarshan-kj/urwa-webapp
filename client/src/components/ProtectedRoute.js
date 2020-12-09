import React from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/Auth";
import { Box, Button, Heading } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { hasPermission } from "utils/Authz";

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

const ProtectedRoute = ({ path, component, adminOnly, permission }) => {
  return (
    <>
      {isAuthenticated() ? (
        <>
          {hasPermission({ adminOnly, permission }) ? (
            <Route to={path}>
              <WithLogoutHeader component={component} />
            </Route>
          ) : (
            <WithLogoutHeader component={Unauthorized} />
          )}
        </>
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
};

const Unauthorized = () => (
  <Heading
    color="white"
    as="h1"
    size="md"
    p="4"
    fontWeight="100"
    textAlign="center"
  >
    Unauthorized
  </Heading>
);

export default ProtectedRoute;

import React from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/Auth";
import {
  Flex,
  Box,
  Spacer,
  Button,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { hasPermission, getUserName } from "utils/Authz";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
} from "@chakra-ui/react";
import { ReactComponent as HomeIcon } from "assets/icons/home.svg";

const getPath = (location, flip) => {
  return location.pathname.includes("admin")
    ? flip
      ? "member"
      : "admin"
    : flip
    ? "admin"
    : "member";
};

const CommonHeader = ({ component: Component, unauthorized }) => {
  const history = useHistory();
  const location = useLocation();

  return (
    <>
      <Flex
        pos="sticky"
        w="100%"
        bgColor="gray.700"
        p={4}
        px={10}
        top={0}
        right={0}
        zIndex={999}
      >
        <Box p="2">
          <HStack>
            <Link to={`/${getPath(location, unauthorized)}/home`}>
              <Icon
                as={HomeIcon}
                w={6}
                h={6}
                fill="teal.400"
                _hover={{ fill: "white" }}
              />
            </Link>
          </HStack>
        </Box>
        <Spacer />
        <Box>
          <Menu>
            {({ isOpen }) => (
              <>
                <MenuButton
                  isActive={isOpen}
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                >
                  {getUserName()}
                </MenuButton>
                <MenuList>
                  <MenuItem>Profile</MenuItem>
                  <MenuItem
                    onClick={() => {
                      logout();
                      history.push("/login");
                    }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </>
            )}
          </Menu>
        </Box>
      </Flex>
      <Box height="100%" bg="gray.200" py={8}>
        <Component />
      </Box>
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
              <CommonHeader unauthorized={false} component={component} />
            </Route>
          ) : (
            <CommonHeader unauthorized={true} component={Unauthorized} />
          )}
        </>
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
};

const Unauthorized = () => {
  const location = useLocation();
  return (
    <VStack>
      <Heading as="h1" size="md" p="4" fontWeight="100" textAlign="center">
        403 Unauthorized
      </Heading>
      <Link to={`/${getPath(location, true)}/home`}>
        <Text>Go to Home</Text>
      </Link>
    </VStack>
  );
};

export default ProtectedRoute;

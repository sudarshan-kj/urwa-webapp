import React from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/Auth";
import {
  Flex,
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
  Spacer,
  Badge,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { isAdmin, hasPermission, getMemberDetails } from "utils/Authz";
import { Link } from "react-router-dom";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { ReactComponent as HomeIcon } from "assets/icons/home.svg";
import { ReactComponent as ProfileIcon } from "assets/icons/user.svg";
import { ReactComponent as LogoutIcon } from "assets/icons/logout.svg";

const getPath = () => {
  if (isAdmin()) {
    return "admin";
  }
  return "member";
};

const CommonHeader = ({ component: Component }) => {
  const history = useHistory();

  return (
    <>
      <Flex
        h="80px"
        align="center"
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
            <Link to={`/${getPath()}/home`}>
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
                  colorScheme="teal"
                  rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                >
                  {getMemberDetails().firstName}
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      history.push(`/${getPath()}/home`);
                    }}
                  >
                    <Icon
                      as={HomeIcon}
                      color="teal.300"
                      fill="teal.300"
                      w={{ base: 2, md: 3 }}
                      h={{ base: 2, md: 3 }}
                      mr={2}
                    />
                    <span>Home</span>
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      history.push(
                        `/member/profile/${getMemberDetails().memberId}`
                      );
                    }}
                  >
                    <Icon
                      as={ProfileIcon}
                      color="teal.300"
                      fill="teal.300"
                      w={{ base: 2, md: 3 }}
                      h={{ base: 2, md: 3 }}
                      mr={2}
                    />
                    <span>Profile</span>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    onClick={() => {
                      logout();
                      history.push("/login");
                    }}
                  >
                    <Icon
                      as={LogoutIcon}
                      color="teal.300"
                      fill="teal.300"
                      w={{ base: 2, md: 3 }}
                      h={{ base: 2, md: 3 }}
                      mr={2}
                    />
                    <span>Logout</span>
                  </MenuItem>
                </MenuList>
              </>
            )}
          </Menu>
        </Box>
      </Flex>
      <Box bg="gray.200" py={8}>
        <Component />
      </Box>

      <Badge colorScheme="teal" pos="fixed" bottom={2} right={2} zIndex={999}>
        {isAdmin() ? "Admin" : "Member"}
      </Badge>
    </>
  );
};

const ProtectedRoute = ({
  path,
  component,
  adminOnly,
  permission,
  ...rest
}) => {
  return (
    <>
      {isAuthenticated() ? (
        <>
          {hasPermission({ adminOnly, permission }) ? (
            <Route to={path} {...rest}>
              <CommonHeader component={component} />
            </Route>
          ) : (
            <CommonHeader component={Unauthorized} />
          )}
        </>
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
};

const Unauthorized = () => {
  return (
    <VStack>
      <Heading as="h1" size="md" p="4" fontWeight="100" textAlign="center">
        403 Unauthorized
      </Heading>
      <Link to={`/${getPath()}/home`}>
        <Text>Go to Home</Text>
      </Link>
    </VStack>
  );
};

export default ProtectedRoute;

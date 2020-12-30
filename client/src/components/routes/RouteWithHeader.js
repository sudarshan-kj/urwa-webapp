import React from "react";
import { Route, Link } from "react-router-dom";
import { Flex, Icon } from "@chakra-ui/react";
import { ReactComponent as HomeIcon } from "assets/icons/home.svg";

const Header = ({ component: Component }) => (
  <>
    <Flex
      h="84px"
      align="center"
      pos="sticky"
      w="100%"
      bgColor="gray.800"
      p={4}
      px={10}
      top={0}
      right={0}
      zIndex={999}
    >
      <Link to="/admin/home">
        <Icon
          as={HomeIcon}
          w={6}
          h={6}
          fill="teal.400"
          _hover={{ fill: "white" }}
        />
      </Link>
    </Flex>
    <Component />
  </>
);

const RouteWithHeader = ({ component, ...rest }) => (
  <Route {...rest}>
    <Header component={component} />
  </Route>
);

export default RouteWithHeader;

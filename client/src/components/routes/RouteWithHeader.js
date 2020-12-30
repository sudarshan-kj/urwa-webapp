import React from "react";
import { Route, Link } from "react-router-dom";
import { Flex, Icon } from "@chakra-ui/react";
import { ReactComponent as HomeIcon } from "assets/icons/home.svg";
import useAutoScrollToTop from "hooks/useAutoScrollToTop";

const Header = ({ component: Component }) => {
  useAutoScrollToTop();
  return (
    /*mainly used in mobile screens. If you scroll down and navigate to a page, the new page will be navigated in the same scroll position.
  In order to prevent that, we set scroll pos (x,y) to (0,0) so that we scroll to the top of the new page while navigating */
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
};

const RouteWithHeader = ({ component, ...rest }) => (
  <Route {...rest}>
    <Header component={component} />
  </Route>
);

export default RouteWithHeader;

import React from "react";
import { Text, Center, VStack } from "@chakra-ui/react";

const NotFound = () => {
  return (
    <Center h="100vh" color="white">
      <VStack>
        <Text>ERR: 404</Text>
        <Text>Page not found</Text>
      </VStack>
    </Center>
  );
};

export default NotFound;

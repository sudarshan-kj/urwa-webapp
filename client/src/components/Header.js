import { Flex, Spacer, Box } from "@chakra-ui/react";

function Header() {
  return (
    <Flex pos="absolute" top={0} right={0} w="50%" color="black">
      <Box p="4">Box 1</Box>
      <Spacer />
      <Box p="4">Box 2</Box>
    </Flex>
  );
}

export default Header;

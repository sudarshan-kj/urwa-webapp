import { Box, Image, Heading, Text, Center, VStack } from "@chakra-ui/react";
import Logo from "assets/logo.png";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <Box pos="absolute" p={4} top={0} right={0} color="white">
        <Link to="/login">Login</Link>
      </Box>
      <Center height="100vh" color="white">
        <VStack spacing={6}>
          <Image src={Logo} alt="URWA logo" />
          <Heading as="h1" size="md" p="4" fontWeight="100" textAlign="center">
            This website is currently under development. Please come back a
            little while later
          </Heading>
          <Text fontSize="xs"> &copy; URWA 2020</Text>
        </VStack>
      </Center>
    </>
  );
}

export default Home;

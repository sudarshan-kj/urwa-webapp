import { Image, Heading, Text, Center, VStack } from "@chakra-ui/react";
import Logo from "assets/logo.png";

function Home() {
  return (
    <Center height="100vh" color="white">
      <VStack spacing={6}>
        <Image src={Logo} alt="URWA logo" />
        <Heading as="h1" size="md" p="4" fontWeight="100" textAlign="center">
          This website is currently under development. Please come back a little
          while later
        </Heading>
        <Text fontSize="xs"> &copy; URWA 2020</Text>
      </VStack>
    </Center>
  );
}

export default Home;

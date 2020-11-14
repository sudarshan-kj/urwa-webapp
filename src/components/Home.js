import { Image, Heading, Text, Center, VStack } from "@chakra-ui/react";
import Logo from "assets/logo.png";

function Home() {
  return (
    <Center height="100vh" color="white">
      <VStack>
        <Image src={Logo} alt="URWA logo" />
        <Heading as="h6" size="lg" p="4" fontWeight="100">
          This website is currently under development. Please come back a little
          while later
        </Heading>
        <Text> &copy; URWA</Text>
      </VStack>
    </Center>
  );
}

export default Home;

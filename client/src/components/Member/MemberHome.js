import { Heading, Text, Center, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <Center height="80vh">
        <VStack spacing={6}>
          <Heading as="h1" size="md" p="4" fontWeight="100" textAlign="center">
            Under Development
          </Heading>
          <Text>
            <Link to="/member/payment">Click here to pay</Link>
          </Text>
        </VStack>
      </Center>
    </>
  );
}

export default Home;

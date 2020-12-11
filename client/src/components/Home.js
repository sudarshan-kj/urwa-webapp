import { Heading, Text, Center, VStack } from "@chakra-ui/react";

function Home() {
  return (
    <>
      <Center height="100vh" color="white">
        <VStack spacing={6}>
          <Heading as="h1" size="md" p="4" fontWeight="100" textAlign="center">
            Payment page
          </Heading>
          <Text fontSize="xs"> &copy; URWA 2020</Text>
        </VStack>
      </Center>
    </>
  );
}

export default Home;

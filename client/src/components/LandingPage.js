import {
  Box,
  Button,
  Image,
  Heading,
  Text,
  Center,
  VStack,
} from "@chakra-ui/react";
import Logo from "assets/logo.png";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <>
      <Center height="100vh" color="white">
        <VStack spacing={6}>
          <Image src={Logo} alt="URWA logo" />
          <Heading as="h1" size="2xl" p="4" fontWeight="100" textAlign="center">
            Welcome to URWA
          </Heading>
          <Box>
            <Link to="/login">
              <Button colorScheme="teal">Member Login</Button>
            </Link>
          </Box>
          <Text
            p="8"
            textAlign="center"
            bg="gray.800"
            pos="absolute"
            bottom="0"
            left="0"
            right="0"
            fontSize="xs"
          >
            &copy; Upkar Residency Welfare Association 2020
          </Text>
        </VStack>
      </Center>
    </>
  );
}

export default LandingPage;

import {
  Box,
  Center,
  Image,
  Input,
  Text,
  Heading,
  Button,
} from "@chakra-ui/react";
import { FormControl, FormLabel, FormHelperText } from "@chakra-ui/react";
import Logo from "assets/logo.png";

const LandingPage = () => (
  <>
    <Box display={{ md: "flex" }}>
      <Center
        bg="gray.700"
        w={{ base: "100%", md: "40%" }}
        h={{ base: "40vh", md: "100vh" }}
        p={8}
        color="white"
      >
        <Box>
          <Box>
            <Center flexShrink={0} p={8}>
              <Image
                boxSize="100px"
                objectFit="cover"
                src={Logo}
                alt="URWA Logo"
              />
            </Center>
            <Center>
              <Heading as="p" size="md">
                Upkar Residency Welfare Association
              </Heading>
            </Center>
          </Box>
          <Text fontSize="xs" p={8}>
            &copy; URWA 2020
          </Text>
        </Box>
      </Center>
      <Center
        bg="gray.200"
        w={{ base: "100%", md: "60%" }}
        h={{ base: "60vh", md: "100vh" }}
        p={4}
        color="black"
      >
        <Box w={{ base: "90%", md: "40%" }}>
          <FormControl id="username" my={8}>
            <FormLabel>Username</FormLabel>
            <Input type="text" bg="gray.100" />
            <FormHelperText textAlign="left">
              Your registered email id
            </FormHelperText>
          </FormControl>
          <FormControl id="password" my={8}>
            <FormLabel>Password</FormLabel>
            <Input type="password" bg="gray.100" />
          </FormControl>
          <Button bg="gray.600" w={"100%"} color="white">
            Login
          </Button>
        </Box>
      </Center>
    </Box>
  </>
);

export default LandingPage;

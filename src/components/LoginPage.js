import {
  Box,
  Center,
  Image,
  Input,
  Text,
  Heading,
  Button,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import React from "react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Logo from "assets/logo.png";

const yupValidationObject = Yup.object({
  name: Yup.string()
    .max(30, "Ah! That's too long! Try a bit shorter")
    .required("Please fill your name"),
  email: Yup.string()
    .max(50, "That email is way too long.")
    .email("That doesn't look like an email address")
    .required("Please fill your email"),
  message: Yup.string()
    .max(300, "You have exceeded your message limit")
    .required("Atleast a short message is required"),
});

const LoginPage = () => {
  const [show, setShow] = React.useState(false);
  const handleShowClick = () => setShow(!show);

  const postData = (values) => {};

  const formik = useFormik({
    initialValues: {
      userid: "",
      password: "",
    },
    validationSchema: yupValidationObject,
    onSubmit: (values, { resetForm }) => {
      postData(values);
      resetForm({ values: "" });
    },
  });
  return (
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
                <Heading textAlign="center" as="p" size="md">
                  Upkar Residency Welfare Association
                </Heading>
              </Center>
            </Box>
            <Text textAlign="center" fontSize="xs" p={8}>
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
              <FormLabel>User ID</FormLabel>
              <Input
                focusBorderColor="teal.400"
                size="lg"
                type="text"
                bg="gray.100"
              />
            </FormControl>
            <FormControl id="password" my={8}>
              <FormLabel>Password</FormLabel>
              <InputGroup size="lg">
                <Input
                  focusBorderColor="teal.400"
                  bg="gray.100"
                  type={show ? "text" : "password"}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    color="teal.500"
                    h="1.75rem"
                    size="xs"
                    onClick={handleShowClick}
                    _focus={{}}
                  >
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button type="submit" w={"100%"} colorScheme="teal" _focus={{}}>
              Login
            </Button>
          </Box>
        </Center>
      </Box>
    </>
  );
};

export default LoginPage;

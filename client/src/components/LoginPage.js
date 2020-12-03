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
import { SlideFade } from "@chakra-ui/transition";
import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Logo from "assets/logo.png";
import axios from "axios";
import config from "../config";
import { useHistory } from "react-router-dom";

const MAX_USERNAME_LENGTH = 50;
const MAX_PASSWORD_LENGTH = 30;

const yupValidationObject = Yup.object({
  userName: Yup.string()
    .max(MAX_USERNAME_LENGTH, "Invalid user ID")
    .email("Invalid user ID")
    .required("Enter your user ID"),
  password: Yup.string()
    .min(4, "Invalid password")
    .max(MAX_PASSWORD_LENGTH, "Invalid password")
    .required("Enter your password"),
});

const LoginPage = () => {
  const [show, setShow] = React.useState(false);
  const [isFormError, setIsFormError] = React.useState(false);
  const handleShowClick = () => setShow(!show);
  const history = useHistory();
  const postData = (values, setSubmitting) => {
    axios
      .post(`${config.API_ENDPOINT}/api/auth/login`, values)
      .then((response) => {
        if (response.status === 201) {
          localStorage.setItem("token", response.data.accessToken);
          history.push("/admin/addMember");
        } else {
          console.log("I was here");
        }
      })
      .catch((err) => setIsFormError(true))
      .finally(setSubmitting(false));
  };

  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },
    validationSchema: yupValidationObject,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      postData(values, setSubmitting);
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
          <Box transition="transform 0.5s" w={{ base: "90%", md: "40%" }}>
            <form onSubmit={formik.handleSubmit}>
              <SlideFade in={true} offsetX="60px">
                <FormControl
                  id="userName"
                  my={8}
                  isInvalid={formik.errors.userName && formik.touched.userName}
                >
                  <FormLabel>User ID</FormLabel>
                  <Input
                    focusBorderColor="teal.400"
                    size="lg"
                    type="text"
                    bg="gray.100"
                    onChange={(e) => {
                      setIsFormError(false);
                      if (e.target.value.length <= MAX_USERNAME_LENGTH + 1)
                        formik.handleChange(e);
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.userName}
                  />
                  <FormErrorMessage>{formik.errors.userName}</FormErrorMessage>
                </FormControl>
              </SlideFade>
              <SlideFade in={true} offsetX="60px">
                <FormControl
                  id="password"
                  my={8}
                  isInvalid={formik.errors.password && formik.touched.password}
                >
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      id="password"
                      focusBorderColor="teal.400"
                      bg="gray.100"
                      type={show ? "text" : "password"}
                      onChange={(e) => {
                        setIsFormError(false);
                        if (e.target.value.length <= MAX_PASSWORD_LENGTH + 1)
                          formik.handleChange(e);
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
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
                  <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                </FormControl>
              </SlideFade>
              <SlideFade in={true} offsetX="60px">
                <Button
                  isLoading={formik.isSubmitting}
                  type="submit"
                  isFullWidth
                  colorScheme="teal"
                  _focus={{}}
                >
                  Login
                </Button>
              </SlideFade>
              {isFormError && (
                <Text mt="10%" color="red.500">
                  Invalid credentials
                </Text>
              )}
            </form>
          </Box>
        </Center>
      </Box>
    </>
  );
};

export default LoginPage;

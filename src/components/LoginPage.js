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
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { SlideFade } from "@chakra-ui/transition";
import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Logo from "assets/logo.png";

const yupValidationObject = Yup.object({
  userId: Yup.string()
    .max(50, "User id too long")
    .email("That doesn't look like an email address")
    .required("Enter your user ID"),
  password: Yup.string()
    .max(20, "Password is too long")
    .required("Please enter your password"),
});

const LoginPage = () => {
  const [show, setShow] = React.useState(false);
  const handleShowClick = () => setShow(!show);

  const { isOpen, onToggle } = useDisclosure();
  const postData = (values) => {};

  const formik = useFormik({
    initialValues: {
      userId: "",
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
          <Box transition="transform 0.5s" w={{ base: "90%", md: "40%" }}>
            <form>
              <SlideFade in={true} offsetX="60px">
                <FormControl
                  id="userId"
                  my={8}
                  isInvalid={formik.errors.userId && formik.touched.userId}
                >
                  <FormLabel>User ID</FormLabel>
                  <Input
                    focusBorderColor="teal.400"
                    size="lg"
                    type="text"
                    bg="gray.100"
                    onChange={(e) => {
                      if (e.target.value.length <= 30 + 1)
                        formik.handleChange(e);
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.userId}
                  />
                  <FormErrorMessage>{formik.errors.userId}</FormErrorMessage>
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
                        if (e.target.value.length <= 30 + 1)
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
                <Button type="submit" w={"100%"} colorScheme="teal" _focus={{}}>
                  Login
                </Button>
              </SlideFade>
            </form>
          </Box>
        </Center>
      </Box>
    </>
  );
};

export default LoginPage;

import React from "react";
import { Heading, VStack } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  Box,
  Input,
  RadioGroup,
  Radio,
  HStack,
  NumberInput,
  FormHelperText,
  NumberInputField,
  Select,
  Button,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import config from "../../config";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const AddMember = () => {
  const [submitError, setSubmitError] = React.useState("");
  const history = useHistory();
  const toast = useToast();

  const createMember = (values, setSubmitting, resetForm) => {
    axios
      .post(`${config.API_ENDPOINT}/api/members/add`, values)
      .then((res) => {
        if (res.status === 201) {
          history.push("/admin/addMember");
          resetForm({ values: "" });
          toast({
            title: "Account created",
            description: `${values.firstName} has been added`,
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        } else {
          toast({
            title: "An error occurred.",
            description: "Unable to create member account.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          throw new Error("Could not create new member");
        }
      })
      .catch((err) => {
        let errorMsg = err.response.data.error[0].message;
        toast({
          title: "Account was not created",
          description: `${errorMsg}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => setSubmitting(false));
  };

  const formik = useFormik({
    initialValues: {
      siteNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      details: {
        mobile: "",
        altContact: "",
        anniversary: "",
        dob: "",
        land: "built",
        noOfFloors: "",
        bloodGroup: "",
        monthlyMaintenance: "true",
        maintenanceAmount: -1,
        borewell: "false",
        siteDimensions: "",
        address: "",
      },
    },

    onSubmit: (values, { resetForm, setSubmitting }) => {
      createMember(values, setSubmitting, resetForm);
    },
  });

  return (
    <Box bg="gray.200" w="60%" m="auto">
      <Box>
        <form onSubmit={formik.handleSubmit}>
          <VStack w="50%" m="auto" py="30px" spacing="40px">
            <Heading as="h1" size="md">
              Member Basic Info
            </Heading>

            <FormControl id="firstName" isRequired>
              <FormLabel>First Name</FormLabel>
              <Input
                focusBorderColor="teal.400"
                bg="gray.100"
                type="text"
                value={formik.values.firstName}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
              />
            </FormControl>

            <FormControl id="lastName" isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                focusBorderColor="teal.400"
                bg="gray.100"
                type="text"
                value={formik.values.lastName}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
              />
            </FormControl>

            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                focusBorderColor="teal.400"
                bg="gray.100"
                type="email"
                value={formik.values.email}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Mobile Number</FormLabel>
              <NumberInput
                value={formik.values.details.mobile}
                id="details.mobile"
                focusBorderColor="teal.400"
                bg="gray.100"
              >
                <NumberInputField
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                />
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Site Number</FormLabel>
              <NumberInput
                value={formik.values.siteNumber}
                id="siteNumber"
                focusBorderColor="teal.400"
                bg="gray.100"
              >
                <NumberInputField
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                />
              </NumberInput>
            </FormControl>
          </VStack>

          <VStack w="50%" m="auto" py="30px" spacing="40px">
            <Heading as="h1" size="md">
              Member Details
            </Heading>

            <FormControl isRequired>
              <FormLabel>Alternate Contact Number</FormLabel>
              <NumberInput
                value={formik.values.details.altContact}
                id="details.altContact"
                focusBorderColor="teal.400"
                bg="gray.100"
              >
                <NumberInputField
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                />
              </NumberInput>
            </FormControl>

            <FormControl id="details.dob" isRequired>
              <FormLabel>Birthday</FormLabel>
              <Input
                focusBorderColor="teal.400"
                bg="gray.100"
                type="date"
                value={formik.values.details.dob}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
              />
            </FormControl>

            <FormControl id="details.anniversary" isRequired>
              <FormLabel>Anniversary Date</FormLabel>
              <Input
                focusBorderColor="teal.400"
                bg="gray.100"
                type="date"
                value={formik.values.details.anniversary}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
              />
            </FormControl>

            <FormControl id="details.bloodGroup">
              <StyledSelect
                value={formik.values.details.bloodGroup}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
                placeholder="Select Blood Group"
              >
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
                <option value="O+">O+</option>
                <option value="A-">A-</option>
                <option value="B-">B-</option>
                <option value="AB-">AB-</option>
                <option value="O-">O-</option>
              </StyledSelect>
            </FormControl>

            <FormControl id="details.address">
              <FormLabel>Address</FormLabel>
              <Input
                focusBorderColor="teal.400"
                bg="gray.100"
                type="text"
                value={formik.values.details.address}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
              />
              <FormHelperText>Enter only main and cross</FormHelperText>
            </FormControl>

            <FormControl id="details.siteDimensions">
              <StyledSelect
                value={formik.values.details.siteDimensions}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
                placeholder="Select site dimensions"
              >
                <option value="30x40">30x40</option>
                <option value="40x60">40x60</option>
                <option value="50x80">50x80</option>
              </StyledSelect>
            </FormControl>

            <FormControl id="details.borewell" as="fieldset">
              <FormLabel as="legend">Borewell</FormLabel>
              <RadioGroup
                value={formik.values.details.borewell}
                onChange={(e) => {
                  formik.setFieldValue("details.borewell", e);
                }}
              >
                <HStack spacing="24px">
                  <Radio bgColor="gray.300" colorScheme="teal" value="true">
                    Yes
                  </Radio>
                  <Radio bgColor="gray.300" colorScheme="teal" value="false">
                    No
                  </Radio>
                </HStack>
              </RadioGroup>
            </FormControl>

            <FormControl id="details.land" as="fieldset">
              <FormLabel as="legend">Land status</FormLabel>
              <RadioGroup
                value={formik.values.details.land}
                onChange={(e) => {
                  if (e === "vacant") {
                    formik.setFieldValue("details.noOfFloors", "NA");
                  }
                  formik.setFieldValue("details.land", e);
                }}
              >
                <HStack spacing="24px">
                  <Radio bgColor="gray.300" colorScheme="teal" value="built">
                    Built
                  </Radio>
                  <Radio bgColor="gray.300" colorScheme="teal" value="vacant">
                    Vacant
                  </Radio>
                </HStack>
              </RadioGroup>
            </FormControl>

            <FormControl
              id="details.noOfFloors"
              isDisabled={formik.values.details.land === "vacant"}
            >
              <StyledSelect
                value={formik.values.details.noOfFloors}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
                placeholder="Select Floor Count"
              >
                <option value="G">G</option>
                <option value="G+1">G+1</option>
                <option value="G+2">G+2</option>
                <option value="G+3">G+3</option>
                <option value="G+4">G+4</option>
              </StyledSelect>
            </FormControl>

            <FormControl id="details.monthlyMaintenance" as="fieldset">
              <FormLabel as="legend">Monthly Maintenance</FormLabel>
              <RadioGroup
                value={formik.values.details.monthlyMaintenance}
                onChange={(e) => {
                  if (e === "false") {
                    formik.setFieldValue("details.maintenanceAmount", -1);
                  }
                  formik.setFieldValue("details.monthlyMaintenance", e);
                }}
              >
                <HStack spacing="24px">
                  <Radio bgColor="gray.300" colorScheme="teal" value="true">
                    Yes
                  </Radio>
                  <Radio bgColor="gray.300" colorScheme="teal" value="false">
                    No
                  </Radio>
                </HStack>
              </RadioGroup>
            </FormControl>

            <FormControl
              id="details.maintenanceAmount"
              isDisabled={formik.values.details.monthlyMaintenance === "false"}
            >
              <StyledSelect
                value={formik.values.details.maintenanceAmount}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
                placeholder="Select Maintenance Amount"
              >
                <option value="300">₹300</option>
                <option value="500">₹500</option>
              </StyledSelect>
            </FormControl>

            <Button
              isLoading={formik.isSubmitting}
              colorScheme="teal"
              type="submit"
              _focus={{}}
            >
              Submit
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

const StyledSelect = ({ placeholder, children, ...rest }) => {
  return (
    <Select
      {...rest}
      _focus={{
        borderColor: "teal.500",
      }}
      bgColor="gray.100"
      placeholder={placeholder}
    >
      {children}
    </Select>
  );
};

export default AddMember;

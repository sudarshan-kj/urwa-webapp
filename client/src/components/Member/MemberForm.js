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
import { useFormik } from "formik";
import { getMemberDetails } from "utils/Authz";

function isDisabled(array, field) {
  return array.some((ele) => ele === field);
}

const MemberForm = ({ seedData, callBack, buttonName }) => {
  const npuf = getMemberDetails().npuf;
  const formik = useFormik({
    initialValues: {
      ...seedData,
    },
    onSubmit: (values, { resetForm, setSubmitting }) => {
      callBack(values, setSubmitting, resetForm);
    },
    enableReinitialize: true,
  });
  return (
    <>
      <Box bg="gray.200" w={{ base: "70%", md: "60%" }} m="auto">
        <Box>
          <form onSubmit={formik.handleSubmit}>
            <VStack
              w={{ base: "100%", md: "50%" }}
              m="auto"
              py="30px"
              spacing="40px"
            >
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

              <FormControl
                id="email"
                isRequired
                isDisabled={isDisabled(npuf, "email")}
              >
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
                {buttonName === "Submit" ? (
                  <FormHelperText>
                    Email address is the User ID for member login
                  </FormHelperText>
                ) : (
                  <FormHelperText>
                    Updated email address will be the new User ID for member
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  focusBorderColor="teal.400"
                  bg="gray.100"
                  type="password"
                  value={formik.values.password}
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                />
                {buttonName === "Submit" ? (
                  <FormHelperText>
                    Leaving this field blank will set the password to
                    [siteNumber][firstName]
                  </FormHelperText>
                ) : (
                  <FormHelperText>
                    Leaving this field blank will have the same previous
                    password
                  </FormHelperText>
                )}
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

            <VStack
              w={{ base: "100%", md: "50%" }}
              m="auto"
              py="30px"
              spacing="40px"
            >
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

              <FormControl id="details.dob">
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

              <FormControl id="details.anniversary">
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
                  <option value="UNKNOWN">UNKNOWN</option>
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

              <FormControl as="fieldset">
                <FormLabel as="legend">Borewell</FormLabel>
                <RadioGroup
                  value={formik.values.details.borewell}
                  onChange={(e) => {
                    formik.setFieldValue("details.borewell", e);
                  }}
                >
                  <HStack spacing="24px">
                    <Radio
                      id="borewell_true"
                      bgColor="gray.300"
                      colorScheme="teal"
                      value="true"
                    >
                      Yes
                    </Radio>
                    <Radio
                      id="borewell_false"
                      bgColor="gray.300"
                      colorScheme="teal"
                      value="false"
                    >
                      No
                    </Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>

              <FormControl as="fieldset">
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
                    <Radio
                      id="land_built"
                      bgColor="gray.300"
                      colorScheme="teal"
                      value="built"
                    >
                      Built
                    </Radio>
                    <Radio
                      id="land_vacant"
                      bgColor="gray.300"
                      colorScheme="teal"
                      value="vacant"
                    >
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

              <FormControl
                as="fieldset"
                isDisabled={isDisabled(npuf, "monthlyMaintenance")}
              >
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
                    <Radio
                      id="monthlyMaintenance_true"
                      bgColor="gray.300"
                      colorScheme="teal"
                      value="true"
                    >
                      Yes
                    </Radio>
                    <Radio
                      id="monthlyMaintenance_false"
                      bgColor="gray.300"
                      colorScheme="teal"
                      value="false"
                    >
                      No
                    </Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>

              <FormControl
                id="details.maintenanceAmount"
                isDisabled={
                  formik.values.details.monthlyMaintenance === "false" ||
                  isDisabled(npuf, "maintenanceAmount")
                }
              >
                <StyledSelect
                  value={formik.values.details.maintenanceAmount}
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  placeholder="Select Maintenance Amount"
                >
                  <option value="100">₹100</option>
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
                {buttonName}
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
    </>
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

export default MemberForm;

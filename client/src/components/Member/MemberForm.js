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
  NumberInputField,
  Select,
  Button,
  Stack,
  Switch,
  FormHelperText,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { getMemberDetails } from "utils/Authz";
import DatePicker from "components/commons/DatePicker";
import { WarningIcon } from "@chakra-ui/icons";

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
      <Box bg="gray.200" w={{ base: "90%", md: "65%" }} m="auto">
        <Box>
          <form onSubmit={formik.handleSubmit}>
            <VStack
              w={{ base: "100%", md: "60%" }}
              m="auto"
              py="30px"
              spacing="40px"
            >
              <Heading
                as="h1"
                size="sm"
                fontWeight="normal"
                p={3}
                bg="gray.600"
                color="white"
                textAlign="center"
                w="100%"
                borderRadius="8px 8px 0 0"
              >
                Member Basic Information
              </Heading>

              <Stack
                my={4}
                p={6}
                spacing={8}
                w="100%"
                border="1px solid teal"
                borderRadius="0 0 8px 8px"
              >
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name 🧔</FormLabel>
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
                  <FormLabel>Email address 📧 </FormLabel>
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
                  <FormLabel>Password 🔑</FormLabel>
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
                  <FormLabel>Mobile Number 📱</FormLabel>
                  <NumberInput
                    value={formik.values.memberDetails.mobile}
                    id="memberDetails.mobile"
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
                  <FormLabel>Site Number #️⃣</FormLabel>
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
                <FormControl>
                  <FormLabel>Block / Door Number 🚪</FormLabel>
                  <Input
                    value={formik.values.doorNumber}
                    id="doorNumber"
                    focusBorderColor="teal.400"
                    bg="gray.100"
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                  />
                  <FormHelperText>
                    Enter this value only if multiple individual units are built
                    on the same site. Else, leave it blank
                  </FormHelperText>
                </FormControl>
              </Stack>
            </VStack>

            <VStack
              w={{ base: "100%", md: "60%" }}
              m="auto"
              py="30px"
              spacing="40px"
            >
              <Heading
                as="h1"
                size="sm"
                fontWeight="normal"
                p={3}
                bg="gray.600"
                color="white"
                textAlign="center"
                w="100%"
                borderRadius="8px 8px 0 0"
              >
                Member Details
              </Heading>

              <Stack
                my={4}
                p={6}
                spacing={8}
                w="100%"
                border="1px solid teal"
                borderRadius="0 0 8px 8px"
              >
                <FormControl>
                  <FormLabel>Alternate Contact Number 📞</FormLabel>
                  <NumberInput
                    value={formik.values.memberDetails.altContact}
                    id="memberDetails.altContact"
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

                <FormControl id="memberDetails.dob">
                  <FormLabel>Birthday 🎉</FormLabel>
                  {/* <Input
                    focusBorderColor="teal.400"
                    bg="gray.100"
                    type="date"
                    value={formik.values.memberDetails.dob}
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                  /> */}

                  <DatePicker
                    id="memberDetails.dob"
                    key={formik.values.memberDetails.siteDimensions}
                    // we are making siteAddress as the key since only when the siteAddress  ( we could have chosen any other value below this date too) is changed,
                    //this component is remounted. If the key is same as value, then after every key stroke value is remounted
                    value={formik.values.memberDetails.dob}
                    onChange={(e) =>
                      formik.setFieldValue("memberDetails.dob", e)
                    }
                  />
                </FormControl>

                <FormControl id="memberDetails.anniversary">
                  <FormLabel>Anniversary 🎎</FormLabel>
                  <DatePicker
                    id="memberDetails.anniversary"
                    key={formik.values.memberDetails.siteDimensions}
                    value={formik.values.memberDetails.anniversary}
                    onChange={(e) =>
                      formik.setFieldValue("memberDetails.anniversary", e)
                    }
                  />
                </FormControl>

                <FormControl
                  id="memberDetails.membershipStartDate"
                  isDisabled={isDisabled(npuf, "membershipStartDate")}
                  isRequired
                >
                  <FormLabel>Membership Start Date 🏳️‍🌈</FormLabel>
                  <Input
                    focusBorderColor="teal.400"
                    bg="gray.100"
                    type="date"
                    value={formik.values.memberDetails.membershipStartDate}
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                  />
                </FormControl>

                <FormControl
                  id="memberDetails.subscriptionStartDate"
                  isDisabled={isDisabled(npuf, "subscriptionStartDate")}
                  isRequired
                >
                  <FormLabel>Subscription Start Date 🏳️‍🌈</FormLabel>
                  <Input
                    focusBorderColor="teal.400"
                    bg="gray.100"
                    type="date"
                    value={formik.values.memberDetails.subscriptionStartDate}
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                  />
                </FormControl>

                <FormControl id="memberDetails.bloodGroup">
                  <StyledSelect
                    value={formik.values.memberDetails.bloodGroup}
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                    placeholder="Select Blood Group 🩸  "
                  >
                    <option value="A+">🅰️+</option>
                    <option value="B+">🅱️+</option>
                    <option value="AB+">🆎+</option>
                    <option value="O+">🅾️+</option>
                    <option value="A-">🅰️-</option>
                    <option value="B-">🅱️-</option>
                    <option value="AB-">🆎-</option>
                    <option value="O-">🅾️-</option>
                    <option value="UNKNOWN">UNKNOWN ❗ </option>
                  </StyledSelect>
                </FormControl>

                <FormControl id="memberDetails.siteAddress" isRequired>
                  <FormLabel>Site Address 📍</FormLabel>
                  <Input
                    focusBorderColor="teal.400"
                    bg="gray.100"
                    type="text"
                    value={formik.values.memberDetails.siteAddress}
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                  />
                  <FormHelperText>Enter only main and cross</FormHelperText>
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="tenantResiding" mb="0">
                    Tenant Residing ?
                  </FormLabel>
                  <Switch
                    colorScheme="teal"
                    id="memberDetails.tenantResiding"
                    isChecked={formik.values.memberDetails.tenantResiding}
                    onChange={(e) => {
                      if (!e.target.checked) {
                        formik.setFieldValue("memberDetails.ownerAddress", "");
                      }
                      formik.setFieldValue(
                        "memberDetails.tenantResiding",
                        e.target.checked
                      );
                    }}
                  />
                </FormControl>

                <FormControl
                  id="memberDetails.ownerAddress"
                  isDisabled={
                    formik.values.memberDetails.tenantResiding === false
                  }
                >
                  <FormLabel>Owner Address 🏦</FormLabel>
                  <Input
                    focusBorderColor="teal.400"
                    bg="gray.100"
                    type="text"
                    value={formik.values.memberDetails.ownerAddress}
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                  />
                  <FormHelperText>
                    Enter full owner address if tenant is residing.
                  </FormHelperText>
                </FormControl>

                <FormControl id="memberDetails.siteDimensions">
                  <StyledSelect
                    value={formik.values.memberDetails.siteDimensions}
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                    placeholder="Select site dimensions 🚩"
                  >
                    <option value="30x40">30x40</option>
                    <option value="30x50">30x50</option>
                    <option value="40x60">40x60</option>
                    <option value="50x80">50x80</option>
                    <option value="Other">Other</option>
                  </StyledSelect>
                </FormControl>

                <FormControl as="fieldset">
                  <FormLabel as="legend">Borewell 🚰</FormLabel>
                  <RadioGroup
                    value={JSON.stringify(formik.values.memberDetails.borewell)}
                    onChange={(e) => {
                      let borewellValue = e === "true" ? true : false;
                      formik.setFieldValue(
                        "memberDetails.borewell",
                        borewellValue
                      );
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
                  <FormLabel as="legend">Land status 🏛️</FormLabel>
                  <RadioGroup
                    value={formik.values.memberDetails.land}
                    onChange={(e) => {
                      if (e === "vacant") {
                        formik.setFieldValue("memberDetails.noOfFloors", "NA");
                      }
                      formik.setFieldValue("memberDetails.land", e);
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
                  id="memberDetails.noOfFloors"
                  isDisabled={formik.values.memberDetails.land === "vacant"}
                >
                  <StyledSelect
                    value={formik.values.memberDetails.noOfFloors}
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                    placeholder="Select Floor Count "
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
                  <FormLabel as="legend">Monthly Maintenance 💰</FormLabel>
                  <RadioGroup
                    value={JSON.stringify(
                      formik.values.memberDetails.monthlyMaintenance
                    )}
                    onChange={(e) => {
                      if (e === "false") {
                        formik.setFieldValue(
                          "memberDetails.maintenanceAmount",
                          -1
                        );
                      }

                      let maintenanceAmount = e === "true" ? true : false;
                      formik.setFieldValue(
                        "memberDetails.monthlyMaintenance",
                        maintenanceAmount
                      );
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
                  id="memberDetails.maintenanceAmount"
                  isDisabled={
                    formik.values.memberDetails.monthlyMaintenance ===
                      "false" || isDisabled(npuf, "maintenanceAmount")
                  }
                >
                  <StyledSelect
                    value={formik.values.memberDetails.maintenanceAmount}
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

                {buttonName === "Submit" && (
                  <FormControl isRequired>
                    <FormLabel>Opening Balance</FormLabel>
                    <NumberInput
                      value={formik.values.memberDetails.openingBalance}
                      id="memberDetails.openingBalance"
                      focusBorderColor="teal.400"
                      bg="gray.100"
                    >
                      <NumberInputField
                        onChange={(e) => {
                          formik.handleChange(e);
                        }}
                      />
                    </NumberInput>
                    <FormHelperText color="red.600">
                      <List spacing={2}>
                        <ListItem>
                          <ListIcon as={WarningIcon} color="red.500" />A
                          negative value indicates a pending due. A positive
                          value indicates an already paid advance.
                        </ListItem>
                        <ListItem>
                          <ListIcon as={WarningIcon} color="red.500" />
                          Opening balance cannot be updated later
                        </ListItem>
                      </List>
                    </FormHelperText>
                  </FormControl>
                )}
              </Stack>

              <Button
                isLoading={formik.isSubmitting}
                size="lg"
                colorScheme="teal"
                type="submit"
                _focus={{}}
                w="100%"
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

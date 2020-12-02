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
} from "@chakra-ui/react";

const AddMember = () => {
  return (
    <Box bg="gray.200" w="60%" m="auto">
      <Box>
        <VStack w="50%" m="auto" py="30px" spacing="40px">
          <Heading as="h1" size="md">
            Member Basic Info
          </Heading>
          <FormControl id="firstName" isRequired>
            <FormLabel>First Name</FormLabel>
            <Input focusBorderColor="teal.400" bg="gray.100" type="text" />
          </FormControl>
          <FormControl id="lastName" isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input focusBorderColor="teal.400" bg="gray.100" type="text" />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input focusBorderColor="teal.400" bg="gray.100" type="email" />
          </FormControl>
          <FormControl id="primaryContact" isRequired>
            <FormLabel>Mobile Number</FormLabel>
            <NumberInput focusBorderColor="teal.400" bg="gray.100">
              <NumberInputField />
            </NumberInput>
          </FormControl>
          <FormControl id="siteNumber">
            <FormLabel>Site Number</FormLabel>
            <NumberInput focusBorderColor="teal.400" bg="gray.100" type="email">
              <NumberInputField />
            </NumberInput>
          </FormControl>
        </VStack>

        <VStack w="50%" m="auto" py="30px" spacing="40px">
          <Heading as="h1" size="md">
            Member Details
          </Heading>
          <FormControl id="secondaryContact" isRequired>
            <FormLabel>Alternate Contact Number</FormLabel>
            <NumberInput focusBorderColor="teal.400" bg="gray.100">
              <NumberInputField />
            </NumberInput>
          </FormControl>
          <FormControl id="dob" isRequired>
            <FormLabel>Birthday</FormLabel>
            <Input focusBorderColor="teal.400" bg="gray.100" type="date" />
          </FormControl>
          <FormControl id="anniversaryDate" isRequired>
            <FormLabel>Anniversary Date</FormLabel>
            <Input focusBorderColor="teal.400" bg="gray.100" type="date" />
          </FormControl>
          <FormControl id="address" isRequired>
            <FormLabel>Address</FormLabel>
            <Input focusBorderColor="teal.400" bg="gray.100" type="text" />
            <FormHelperText>Enter only main and cross</FormHelperText>
          </FormControl>
          <FormControl as="fieldset">
            <FormLabel as="legend">Land status</FormLabel>
            <RadioGroup defaultValue="built">
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
          <FormControl id="floorCount">
            <Select
              bgColor="gray.100"
              colorScheme="teal"
              placeholder="Select Floor Count"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="3+">3+</option>
            </Select>
            <FormHelperText>Ground floor is counted as 1</FormHelperText>
          </FormControl>
          <FormControl>
            <Select
              bgColor="gray.100"
              colorScheme="teal"
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
            </Select>
          </FormControl>
          <FormControl>
            <Select
              bgColor="gray.100"
              colorScheme="teal"
              placeholder="Select Maintenance Amount"
            >
              <option value="300">₹300</option>
              <option value="500">₹500</option>
            </Select>
          </FormControl>
          <FormControl as="fieldset">
            <FormLabel as="legend">Borewell</FormLabel>
            <RadioGroup defaultValue="no">
              <HStack spacing="24px">
                <Radio bgColor="gray.300" colorScheme="teal" value="yes">
                  Yes
                </Radio>
                <Radio bgColor="gray.300" colorScheme="teal" value="no">
                  No
                </Radio>
              </HStack>
            </RadioGroup>
          </FormControl>
          <FormControl>
            <Select
              bgColor="gray.100"
              colorScheme="teal"
              placeholder="Select site dimensions"
            >
              <option value="30x40">30x40</option>
              <option value="40x60">40x60</option>
              <option value="50x80">50x80</option>
            </Select>
          </FormControl>
        </VStack>
      </Box>
    </Box>
  );
};

export default AddMember;

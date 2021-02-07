import React, { useState } from "react";
import {
  NumberInputField,
  Select,
  HStack,
  NumberInput,
} from "@chakra-ui/react";

const DatePicker = () => {
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState("1");
  return (
    <HStack w={{ base: "100%", md: "50%" }}>
      <NumberInput value={day} focusBorderColor="teal.400" bg="gray.100">
        <NumberInputField onChange={(e) => setDay(e.target.value)} />
      </NumberInput>

      <Select
        placeholder="Select Month"
        _focus={{
          borderColor: "teal.500",
        }}
        bgColor="gray.100"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      >
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
      </Select>
    </HStack>
  );
};

export default DatePicker;

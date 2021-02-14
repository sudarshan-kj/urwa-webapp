import React, { useEffect, useState } from "react";
import {
  NumberInputField,
  Select,
  HStack,
  NumberInput,
} from "@chakra-ui/react";

const monthDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const DatePicker = ({ id, value, onChange }) => {
  let initialDay = Number(value.split("-")[2]);
  let initialMonth = Number(value.split("-")[1]);

  // let initialDay = 2;
  // let initialMonth = 2;

  const [day, setDay] = useState(initialDay);
  const [month, setMonth] = useState(initialMonth);
  const [maxDate, setMaxDate] = useState(31);
  const [date, setDate] = useState(`2000-${month}-${day}`);

  useEffect(() => {
    onChange(date);
  }, [date]);

  useEffect(() => {
    setMaxDate(monthDays[month - 1]);
    setDate(`2000-${month}-${day}`);
  }, [day, month]);

  return (
    <HStack w={{ base: "100%", md: "50%" }}>
      <Select
        id={`${id}-month`}
        placeholder="Month"
        _focus={{
          borderColor: "teal.500",
        }}
        bgColor="gray.100"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      >
        <option value={1}>January</option>
        <option value={2}>February</option>
        <option value={3}>March</option>
        <option value={4}>April</option>
        <option value={5}>May</option>
        <option value={6}>June</option>
        <option value={7}>July</option>
        <option value={8}>August</option>
        <option value={9}>September</option>
        <option value={10}>October</option>
        <option value={11}>November</option>
        <option value={12}>December</option>
      </Select>
      <NumberInput
        id={`${id}-day`}
        min={1}
        max={maxDate}
        value={day}
        focusBorderColor="teal.400"
        bg="gray.100"
        isDisabled={!month}
      >
        <NumberInputField
          placeholder="Day"
          onChange={(e) => setDay(e.target.value)}
        />
      </NumberInput>
    </HStack>
  );
};

export default DatePicker;

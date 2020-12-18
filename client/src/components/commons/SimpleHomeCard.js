import React from "react";
import { Stack, Text, Center, Icon } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const SimpleCard = ({ link, textContent, icon }) => (
  <Link to={link}>
    <Center
      shadow="xl"
      borderRadius="20px"
      h="200px"
      p={8}
      bg="gray.100"
      _hover={{
        border: "2px solid",
        borderColor: "teal.300",
      }}
    >
      <Stack
        direction={{ base: "column", md: "column" }}
        justify="center"
        align="center"
        spacing={4}
      >
        <Icon
          as={icon}
          color="teal.300"
          fill="teal.300"
          w={{ base: 4, md: 6 }}
          h={{ base: 4, md: 6 }}
        />
        <Text align="center" fontSize={{ base: "xl", md: "2xl" }}>
          {textContent}
        </Text>
      </Stack>
    </Center>
  </Link>
);

export default SimpleCard;

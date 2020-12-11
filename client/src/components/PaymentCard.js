import React from "react";
import { Center, Stack, Icon, Text } from "@chakra-ui/react";
import { ReactComponent as CrediCardIcon } from "assets/icons/credit-card.svg";
import { Link } from "react-router-dom";

const PaymentCard = () => {
  return (
    <Link to="/member/payment">
      <Center
        shadow="xl"
        borderRadius="20px"
        h="200px"
        p={8}
        bg="gray.100"
        _hover={{
          border: "2px solid",
          borderColor: "teal.200",
        }}
      >
        <Stack
          direction={{ base: "column", md: "row" }}
          justify="center"
          align="center"
        >
          <Icon
            as={CrediCardIcon}
            fill="teal.300"
            w={{ base: 4, md: 6 }}
            h={{ base: 4, md: 6 }}
          />
          <Text align="center" fontSize={{ base: "xl", md: "2xl" }}>
            My Payments
          </Text>
        </Stack>
      </Center>
    </Link>
  );
};

export default PaymentCard;

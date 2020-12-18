import React from "react";
import { Stack, Box, SimpleGrid } from "@chakra-ui/react";
import SimpleCard from "components/commons/SimpleHomeCard";
import { ReactComponent as CreditCardIcon } from "assets/icons/credit-card.svg";

const MemberHome = () => {
  return (
    <>
      <Box h={{ base: "100%", md: "80vh" }} m={8}>
        <Stack w="50%" m="auto" spacing={8}>
          <SimpleGrid row={1} minChildWidth="160px" spacing="40px">
            <SimpleCard
              link="/member/payment"
              icon={CreditCardIcon}
              textContent="My Payments"
            />
          </SimpleGrid>
        </Stack>
      </Box>
    </>
  );
};

export default MemberHome;

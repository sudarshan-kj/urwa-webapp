import React from "react";
import { Stack, Box, SimpleGrid } from "@chakra-ui/react";
import PaymentCard from "components/PaymentCard";

const MemberHome = () => {
  return (
    <>
      <Box h={{ base: "100%", md: "80vh" }} m={8}>
        <Stack w="50%" m="auto" spacing={8}>
          <SimpleGrid row={1} minChildWidth="160px" spacing="40px">
            <PaymentCard />
          </SimpleGrid>
        </Stack>
      </Box>
    </>
  );
};

export default MemberHome;

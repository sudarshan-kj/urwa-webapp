import React from "react";
import { Stack, Box, SimpleGrid, Text, Center, Icon } from "@chakra-ui/react";
import { AddIcon, ViewIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import PaymentCard from "components/PaymentCard";

const AdminHome = () => {
  return (
    <>
      <Box h={{ base: "100%", md: "80vh" }} m={8}>
        <Stack w="80%" m="auto" spacing={8}>
          <SimpleGrid row={1} minChildWidth="160px" spacing="40px">
            <Link to="/admin/addMember">
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
                  direction={{ base: "column", md: "row" }}
                  justify="center"
                  align="center"
                >
                  <Icon
                    as={AddIcon}
                    color="teal.300"
                    w={{ base: 4, md: 6 }}
                    h={{ base: 4, md: 6 }}
                  />
                  <Text align="center" fontSize={{ base: "xl", md: "2xl" }}>
                    Add Member
                  </Text>
                </Stack>
              </Center>
            </Link>
            <Link to="/admin/viewMembers">
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
                    as={ViewIcon}
                    color="teal.300"
                    w={{ base: 4, md: 6 }}
                    h={{ base: 4, md: 6 }}
                  />
                  <Text align="center" fontSize={{ base: "xl", md: "2xl" }}>
                    View Members
                  </Text>
                </Stack>
              </Center>
            </Link>
            <PaymentCard />
          </SimpleGrid>
        </Stack>
      </Box>
    </>
  );
};

export default AdminHome;

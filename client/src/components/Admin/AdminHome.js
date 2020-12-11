import React from "react";
import {
  Stack,
  Box,
  SimpleGrid,
  Text,
  Center,
  Badge,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { AddIcon, ViewIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import PaymentCard from "components/PaymentCard";

const AdminHome = () => {
  return (
    <>
      <Box h="80vh" m={8}>
        <Stack w="50%" m="auto" spacing={8}>
          <SimpleGrid row={1} minChildWidth="160px" spacing="40px">
            <Link to="/admin/addMember">
              <Center
                borderRadius="20px"
                h="200px"
                p={8}
                bg="gray.100"
                _hover={{
                  border: "2px solid",
                  borderColor: "teal.300",
                }}
              >
                <HStack>
                  <Icon
                    as={AddIcon}
                    color="teal.300"
                    w={{ base: 4, md: 6 }}
                    h={{ base: 4, md: 6 }}
                  />
                  <Text fontSize={{ base: "xl", md: "2xl" }}>Add Member</Text>
                </HStack>
              </Center>
            </Link>
            <Link to="/admin/viewMembers">
              <Center
                borderRadius="20px"
                h="200px"
                p={8}
                bg="gray.100"
                _hover={{
                  border: "2px solid",
                  borderColor: "teal.200",
                }}
              >
                <HStack>
                  <Icon
                    as={ViewIcon}
                    color="teal.300"
                    w={{ base: 4, md: 6 }}
                    h={{ base: 4, md: 6 }}
                  />
                  <Text fontSize={{ base: "xl", md: "2xl" }}>View Members</Text>
                </HStack>
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

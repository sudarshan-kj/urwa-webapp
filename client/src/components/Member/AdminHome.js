import React from "react";
import { Box, SimpleGrid, Heading, Center } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const AdminHome = () => {
  return (
    <>
      <Box h="80vh" m={8}>
        <SimpleGrid minChildWidth="120px" spacing="40px">
          <Link to="/admin/addMember">
            <Center borderRadius="20px" h="200px" bg="gray.100">
              <Heading>Add New Member</Heading>
            </Center>
          </Link>
          <Link to="/admin/viewMembers">
            <Center borderRadius="20px" h="200px" bg="gray.100">
              <Heading>View Members</Heading>
            </Center>
          </Link>
        </SimpleGrid>
      </Box>
    </>
  );
};

export default AdminHome;

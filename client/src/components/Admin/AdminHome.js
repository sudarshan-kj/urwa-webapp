import React from "react";
import { Stack, Box, SimpleGrid } from "@chakra-ui/react";
import { AddIcon, ViewIcon } from "@chakra-ui/icons";
import SimpleCard from "components/commons/SimpleHomeCard";

import { ReactComponent as CreditCardIcon } from "assets/icons/credit-card.svg";

const gridDataArray = [
  {
    link: "/admin/addMember",
    icon: AddIcon,
    textContent: "Add Member",
  },
  {
    link: "/admin/viewMembers",
    icon: ViewIcon,
    textContent: "View Members",
  },
  {
    link: "/member/payment",
    icon: CreditCardIcon,
    textContent: "My Payments",
  },
];

const AdminHome = () => {
  return (
    <>
      <Box h={{ base: "100%", md: "80vh" }} m={8}>
        <Stack w="80%" m="auto" spacing={8}>
          <SimpleGrid row={1} minChildWidth="160px" spacing="40px">
            {gridDataArray.map((card) => (
              <SimpleCard
                link={card.link}
                textContent={card.textContent}
                icon={card.icon}
              />
            ))}
          </SimpleGrid>
        </Stack>
      </Box>
    </>
  );
};

export default AdminHome;

import React from "react";
import { Stack, Box, SimpleGrid } from "@chakra-ui/react";
import { SunIcon } from "@chakra-ui/icons";
import SimpleHomeCard from "components/commons/SimpleHomeCard";
import { ReactComponent as CreditCardIcon } from "assets/icons/credit-card.svg";
import { ReactComponent as UserIcon } from "assets/icons/user.svg";
import { getMemberDetails } from "utils/Authz";
const gridDataArray = [
  {
    link: "/member/payment",
    icon: CreditCardIcon,
    textContent: "My Payments",
  },
  {
    link: "#",
    icon: SunIcon,
    textContent: "Donations",
  },
  {
    link: `/member/profile/${getMemberDetails().memberId}`,
    icon: UserIcon,
    textContent: "My Profile",
  },
];
const MemberHome = () => {
  return (
    <>
      <Box h={{ base: "100%", md: "80vh" }} m={8}>
        <Stack w="50%" m="auto" spacing={8}>
          <SimpleGrid row={1} minChildWidth="160px" spacing="40px">
            {gridDataArray.map((card) => (
              <SimpleHomeCard
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

export default MemberHome;

import React from "react";
import { Stack, Center, Box, SimpleGrid, HStack } from "@chakra-ui/react";
import { CalendarIcon, SunIcon } from "@chakra-ui/icons";
import SimpleHomeCard from "components/commons/SimpleHomeCard";
import { ReactComponent as CreditCardIcon } from "assets/icons/credit-card.svg";
import { ReactComponent as UserIcon } from "assets/icons/user.svg";
import { getMemberDetails } from "utils/Authz";

const MemberHome = () => {
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
  return (
    <Box h={"calc(90vh - 80px)"} w="100%">
      <Center h="100%" w="50%" m="auto">
        <SimpleGrid w="100%" minChildWidth="160px" spacing="40px">
          {gridDataArray.map((card) => (
            <SimpleHomeCard
              link={card.link}
              textContent={card.textContent}
              icon={card.icon}
            />
          ))}
        </SimpleGrid>
      </Center>
    </Box>
  );
};

export default MemberHome;

import React from "react";
import { SunIcon } from "@chakra-ui/icons";
import Home from "components/Home";
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
  return <Home data={gridDataArray} />;
};

export default MemberHome;

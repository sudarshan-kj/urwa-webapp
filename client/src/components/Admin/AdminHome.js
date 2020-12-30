import React from "react";
import { Text, Box } from "@chakra-ui/react";
import { AddIcon, ViewIcon, SunIcon, CheckCircleIcon } from "@chakra-ui/icons";
import Home from "components/Home";
import { ReactComponent as CreditCardIcon } from "assets/icons/credit-card.svg";
import { authAxios } from "utils/Auth";
import { getMemberDetails } from "utils/Authz";
import { ReactComponent as UserIcon } from "assets/icons/user.svg";

const AdminHome = () => {
  const [metaData, setMetaData] = React.useState("");
  React.useEffect(() => {
    authAxios()
      .get("/api/members/count")
      .then((result) => setMetaData(`Member count: ${result.data.memberCount}`))
      .catch((err) => console.error("Could not fetch member count"));
  }, []);
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
      metaData: metaData,
    },
    {
      link: "/member/payment",
      icon: CreditCardIcon,
      textContent: "My Payments",
    },
    {
      link: `/member/profile/${getMemberDetails().memberId}`,
      icon: UserIcon,
      textContent: "My Profile",
    },
    {
      link: "#",
      icon: SunIcon,
      textContent: "Donations",
    },
    {
      link: "/featureList",
      icon: CheckCircleIcon,
      textContent: "Feature List",
    },
  ];

  return (
    <Box p={4}>
      <Home data={gridDataArray} />
    </Box>
  );
};

export default AdminHome;

import React from "react";
import { SunIcon } from "@chakra-ui/icons";
import Home from "components/Home";
import { authAxios } from "utils/Auth";
import { ReactComponent as CreditCardIcon } from "assets/icons/credit-card.svg";
import { ReactComponent as UserIcon } from "assets/icons/user.svg";
import { getMemberDetails } from "utils/Authz";

const MemberHome = () => {
  const [metaData, setMetaData] = React.useState({
    count: "",
    maintenanceAmount: "",
  });
  React.useEffect(() => {
    authAxios()
      .get(`/api/members/metaData/${getMemberDetails().memberId}`)
      .then((result) =>
        setMetaData({
          count: result.data.memberCount,
          maintenanceAmount: result.data.maintenanceAmount,
        })
      )
      .catch((err) => console.error("Could not fetch member count"));
  }, []);
  const gridDataArray = [
    {
      link: `/member/payment`,
      icon: CreditCardIcon,
      textContent: "My Payments",
      maintenanceAmount: metaData.maintenanceAmount,
      metaData: `Monthly Maintenance: ₹ ${metaData.maintenanceAmount}`,
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

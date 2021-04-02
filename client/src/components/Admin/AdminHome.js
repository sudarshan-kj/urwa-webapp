import React from "react";
import {
  AddIcon,
  ViewIcon,
  SunIcon,
  CheckCircleIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import Home from "components/Home";
import { ReactComponent as CreditCardIcon } from "assets/icons/credit-card.svg";
import { authAxios } from "utils/Auth";
import { getMemberDetails } from "utils/Authz";
import { ReactComponent as UserIcon } from "assets/icons/user.svg";

const AdminHome = () => {
  const [metaData, setMetaData] = React.useState({
    count: "",
    maintenanceAmount: "",
  });
  React.useEffect(() => {
    authAxios()
      .get(`/api/members/metaData/${getMemberDetails().memberId}`)
      .then((result) =>
        setMetaData({
          count: result.data.data.memberCount,
          maintenanceAmount: result.data.data.maintenanceAmount,
        })
      )
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
      metaData: `Member Count: ${metaData.count}`,
    },
    {
      link: "/admin/viewPayments",
      icon: HamburgerIcon,
      textContent: "View Member Payments",
    },
    {
      link: `/member/payment`,
      icon: CreditCardIcon,
      maintenanceAmount: metaData.maintenanceAmount,
      textContent: "My Payments",
      metaData: `Monthly Maintenance: ₹ ${metaData.maintenanceAmount}`,
    },
    {
      link: `/member/profile/${getMemberDetails().memberId}`,
      icon: UserIcon,
      textContent: "My Profile",
    },
    {
      link: "/donations",
      icon: SunIcon,
      textContent: "Donations",
    },
    {
      link: "/featureList",
      icon: CheckCircleIcon,
      textContent: "Feature List",
    },
  ];

  return <Home data={gridDataArray} />;
};

export default AdminHome;

import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { authAxios } from "utils/Auth";
import { useToast } from "@chakra-ui/react";
import MemberForm from "components/Member/MemberForm";
import seedDataJSON from "seedData/addMember.json";
import { getPath } from "utils/Authz";

const extractDate = (dateValue) => {
  return dateValue.split("T")[0];
};

const UpdateMember = () => {
  const [seedData, setSeedData] = React.useState(seedDataJSON);
  const { memberId } = useParams();
  const history = useHistory();
  const toast = useToast();

  React.useEffect(() => {
    authAxios()
      .get(`/api/members/${memberId}?details=true`)
      .then((result) => {
        const details = result.data.mDetails[0];
        delete details.memberId;
        delete details.id;
        const newObject = { ...result.data };
        delete newObject.mDetails;
        newObject.details = details;
        const {
          dob,
          anniversary,
          membershipStartDate,
          subscriptionStartDate,
        } = details;
        if (dob) newObject.details.dob = extractDate(dob);
        if (anniversary)
          newObject.details.anniversary = extractDate(anniversary);
        if (membershipStartDate)
          newObject.details.membershipStartDate = extractDate(
            membershipStartDate
          );
        if (subscriptionStartDate)
          newObject.details.subscriptionStartDate = extractDate(
            subscriptionStartDate
          );

        //Tenant residing value in the ui expects a boolean, but since we get strings, we convert to boolean

        newObject.details.tenantResiding =
          newObject.details.tenantResiding === "true";
        newObject.password = "";
        // All the following data needs to be removed, since they are coming fromt the raw data we extracted from db
        delete newObject.permissionLevel;
        delete newObject.id;
        delete newObject.npuf;

        setSeedData(newObject);
      });
  }, [memberId]);

  const updateMember = (values, setUpdating) => {
    authAxios()
      .patch(`/api/members/${memberId}`, values)
      .then((res) => {
        if (res.status === 200) {
          history.push(`${getPath("/admin/viewMembers", "/member/home")}`);
          toast({
            title: "Account updated",
            description: `${values.firstName} has been updated`,
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        } else {
          toast({
            title: "An error occurred.",
            description: "Unable to update member account.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          throw new Error("Could not update new member");
        }
      })
      .catch((err) => {
        let errorMsg = "CMSG: Something went wrong";
        if (err.response) {
          errorMsg = err.response.data.error[0].message;
        }
        toast({
          title: "Account was not updated",
          description: `${errorMsg}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => setUpdating(false));
  };
  return (
    <>
      <MemberForm
        seedData={seedData}
        callBack={updateMember}
        buttonName="Update"
      />
    </>
  );
};

export default UpdateMember;

import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { authAxios } from "utils/Auth";
import { useToast } from "@chakra-ui/react";
import MemberForm from "components/Member/MemberForm";
import seedDataJSON from "seedData/addMember.json";

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
        if (newObject.details.dob)
          newObject.details.dob = newObject.details.dob.split("T")[0];
        if (newObject.details.anniversary)
          newObject.details.anniversary = newObject.details.anniversary.split(
            "T"
          )[0];
        if (newObject.details.membershipStartDate)
          newObject.details.membershipStartDate = newObject.details.membershipStartDate.split(
            "T"
          )[0];

        delete newObject.permissionLevel;
        delete newObject.id;
        delete newObject.npuf;
        newObject.password = "";
        setSeedData(newObject);
      });
  }, [memberId]);

  const updateMember = (values, setUpdating, resetForm) => {
    authAxios()
      .patch(`/api/members/${memberId}`, values)
      .then((res) => {
        if (res.status === 200) {
          history.push("/admin/viewMembers");
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

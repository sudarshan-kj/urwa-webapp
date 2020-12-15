import React from "react";
import { useHistory } from "react-router-dom";
import { authAxios } from "utils/Auth";
import { useToast } from "@chakra-ui/react";
import AddMemberForm from "./AddMemberForm";
import seedDataJSON from "seedData/addMember.json";

const AddMember = () => {
  const history = useHistory();
  const toast = useToast();

  const createMember = (values, setSubmitting, resetForm) => {
    authAxios()
      .post("/api/members/add", values)
      .then((res) => {
        if (res.status === 201) {
          history.push("/admin/addMember");
          resetForm({ values: "" });
          toast({
            title: "Account created",
            description: `${values.firstName} has been added`,
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        } else {
          toast({
            title: "An error occurred.",
            description: "Unable to create member account.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          throw new Error("Could not create new member");
        }
      })
      .catch((err) => {
        let errorMsg = err.response.data.error[0].message;
        toast({
          title: "Account was not created",
          description: `${errorMsg}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <AddMemberForm
      seedData={seedDataJSON}
      callBack={createMember}
      buttonName="Submit"
    />
  );
};

export default AddMember;

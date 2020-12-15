import React from "react";
import { Heading, VStack } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  Box,
  Input,
  RadioGroup,
  Radio,
  HStack,
  NumberInput,
  FormHelperText,
  NumberInputField,
  Select,
  Button,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import { authAxios } from "utils/Auth";
import { useToast } from "@chakra-ui/react";
import AddMemberForm from "./AddMemberForm";

const UpdateMember = ({ isUpdate, memberId, seedData }) => {
  const history = useHistory();
  const toast = useToast();

  const updateMember = (values, memberId, setUpdating) => {
    authAxios()
      .patch(`/api/members/${memberId}`, values)
      .then((res) => {
        if (res.status === 201) {
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
        let errorMsg = err.response.data.error[0].message;
        toast({
          title: "Account was not update",
          description: `${errorMsg}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => setUpdating(false));
  };
  return <AddMemberForm />;
};

export default UpdateMember;

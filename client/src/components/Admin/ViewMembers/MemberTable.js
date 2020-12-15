import React from "react";
import { Spinner, Center, useToast } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, TableCaption } from "@chakra-ui/react";
import MemberItem from "./MemberItem";
import { sortBy } from "lodash";
import { authAxios } from "utils/Auth";

const membersTableReducer = (state, action) => {
  switch (action.type) {
    case "MEMBERS_FETCH_SUCCESS":
      return { ...state, data: action.payload, isLoading: false };
    case "MEMBER_DELETE":
      return {
        ...state,
        data: state.data.filter((item) => action.payload.id !== item.id),
      };

    case "MEMBERS_FETCH_INIT":
      return { ...state, isLoading: true, isError: false };
    case "MEMBERS_FETCH_FAILED":
      return {
        ...state,
        isLoading: false,
        isError: true,
        message: action.message,
      };
    default:
      throw new Error("Invalid / No action type received");
  }
};

const MemberTable = () => {
  const [membersList, dispatchMembersList] = React.useReducer(
    membersTableReducer,
    {
      data: [],
      isLoading: false,
      isError: false,
      message: "",
    }
  );

  const toast = useToast();
  const handleDelete = (memberItem) => {
    authAxios()
      .delete(`/api/members/${memberItem.id}`)
      .then(() => {
        dispatchMembersList({
          type: "MEMBER_DELETE",
          payload: { id: memberItem.id },
        });
        toast({
          title: "Member deleted",
          description: `${memberItem.firstName} has been deleted`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(() => {
        toast({
          title: "Delete failed",
          description: `Failed to delete ${memberItem.firstName}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const fetchMembers = React.useCallback(async () => {
    dispatchMembersList({
      type: "MEMBERS_FETCH_INIT",
      message: "Initializing member data fetch",
    });
    try {
      const response = await authAxios().get(
        "/api/members/list?page=0&limit=20"
      );
      if (response.status === 200) {
        dispatchMembersList({
          type: "MEMBERS_FETCH_SUCCESS",
          payload: response.data,
          message: "Successfully fetched data",
        });
      } else {
        dispatchMembersList({
          type: "MEMBERS_FETCH_FAILED",
          message: "Response from server was not OK",
        });
      }
    } catch {
      dispatchMembersList({
        type: "MEMBERS_FETCH_FAILED",
        message: "Something went wrong",
      });
    }
  }, []);

  React.useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const [sort, setSort] = React.useState(
    JSON.parse(localStorage.getItem("sortInfo")) || {
      sortOnColumn: "NONE",
      sortAsc: true,
    }
  );

  React.useEffect(() => {
    localStorage.setItem("sortInfo", JSON.stringify(sort));
  }, [sort]);

  const SORT = {
    NONE: (list) => list,
    SITE_NUMBER: (list) => sortBy(list, "siteNumber"),
    NAME: (list) => sortBy(list, "firstName"),
    EMAIL: (list) => sortBy(list, "email"),
  };

  const sortFunction = SORT[sort.sortOnColumn];

  const sortedList = sort.sortAsc
    ? sortFunction(membersList.data)
    : sortFunction(membersList.data).reverse();

  const handleSort = (sortOnColumn) => {
    setSort((prevState) =>
      prevState.sortOnColumn !== sortOnColumn
        ? { ...prevState, sortOnColumn }
        : { ...prevState, sortAsc: !prevState.sortAsc }
    );
  };
  return (
    <Center>
      {membersList.isLoading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="teal.500"
          size="xl"
        />
      ) : (
        <Table variant="striped" colorScheme="gray">
          {membersList.isError ? (
            <TableCaption color="red.500">{membersList.message}</TableCaption>
          ) : (
            <TableCaption>Member info table</TableCaption>
          )}
          <Thead>
            <Tr>
              <Th>Site Number</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Edit</Th>
              <Th>Delete</Th>
            </Tr>
          </Thead>
          <Tbody>
            {membersList.data.map((memberItem) => (
              <MemberItem
                key={memberItem.id}
                memberItem={memberItem}
                handleDelete={handleDelete}
              />
            ))}
          </Tbody>
        </Table>
      )}
    </Center>
  );
};

export default MemberTable;

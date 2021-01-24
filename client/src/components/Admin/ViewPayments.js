import React, { useEffect, useReducer } from "react";
import { Spinner, Center, useToast, Badge } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  TableCaption,
} from "@chakra-ui/react";
import { authAxios } from "utils/Auth";
import date from "date-and-time";

const datePattern = date.compile("MMM YYYY");

const payeeTableReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, isLoading: true, isError: false };
    case "FETCH_SUCCESS":
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        isError: false,
      };
    case "FETCH_FAILED":
      return {
        ...state,
        message: action.message,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error("Invalid action type received");
  }
};

const ViewPayments = () => {
  const [payeeList, dispatchPayeeList] = useReducer(payeeTableReducer, {
    data: [],
    isLoading: false,
    isError: false,
    message: "",
  });

  useEffect(() => {
    async function fetchPaymentDetails() {
      try {
        const response = await authAxios().get(
          `/api/members/payments/all?page=0&limit=20`
        );
        if (response.status === 200) {
          dispatchPayeeList({
            type: "FETCH_SUCCESS",
            payload: response.data,
          });
        } else {
          dispatchPayeeList({
            type: "FETCH_FAILED",
            message: "Response from server was not OK",
          });
        }
      } catch {
        dispatchPayeeList({
          type: "FETCH_FAILED",
          message: "Error while fetching payee details",
        });
      }
    }
    fetchPaymentDetails();
  }, []);

  return (
    <Center>
      {payeeList.isLoading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="teal.500"
          size="xl"
        />
      ) : (
        <Table variant="striped" colorScheme="gray">
          {payeeList.isError ? (
            <TableCaption color="red.500">{payeeList.message}</TableCaption>
          ) : (
            <TableCaption>Member Payment Info Table</TableCaption>
          )}
          <Thead>
            <Tr>
              <Th>Site Number</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Due For</Th>
              <Th>Overdue For</Th>
              <Th>Total Due Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {payeeList.data.map((memberItem) => (
              <Tr>
                <Td>{memberItem.siteNumber}</Td>
                <Td>
                  {memberItem.firstName} {memberItem.lastName}
                </Td>
                <Td>{memberItem.email}</Td>
                <Td>
                  <Badge colorScheme="orange">
                    {memberItem.dueFor &&
                      date.format(new Date(memberItem.dueFor), datePattern)}
                  </Badge>
                </Td>
                <Td>
                  {memberItem.overdueFor && (
                    <>
                      <Badge colorScheme="red">
                        {date.format(
                          new Date(memberItem.overdueFor[0]),
                          datePattern
                        )}
                      </Badge>
                      -
                      <Badge colorScheme="red">
                        {date.format(
                          new Date(
                            memberItem.overdueFor[
                              memberItem.overdueFor.length - 1
                            ]
                          ),
                          datePattern
                        )}
                      </Badge>
                    </>
                  )}
                </Td>
                <Td>
                  {memberItem.totalAmountDue > 0 && (
                    <Badge colorScheme="teal">
                      ₹ {memberItem.totalAmountDue}
                    </Badge>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Center>
  );
};

export default ViewPayments;

import React, { useEffect, useState } from "react";
import {
  Button,
  Center,
  useToast,
  Spinner,
  VStack,
  Box,
  SimpleGrid,
  Stack,
  Badge,
  Text,
  Skeleton,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import ReactDependentScript from "react-dependent-script";
import { useHistory, useLocation } from "react-router-dom";
import { authAxios } from "utils/Auth";
import { getMemberDetails } from "utils/Authz";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import date from "date-and-time";

const datePattern = date.compile("MMM DD, YYYY");

const MemberPayment = () => {
  const [reqBodyBolt, setReqBodyBolt] = useState({});
  const [isPayButtonActive, setPayButtonActive] = useState(false);
  const [isValidMember, setValidMember] = useState("NA");
  const [paymentDataArrayState, setPaymentDataArrayState] = useState({
    overdueFor: [],
    dueFor: "",
    lastPaidFor: [],
    memberId: "",
    totalAmountDue: 0,
  });
  const [isCardLoading, setCardLoading] = useState(true);
  const [shouldMemberPay, setShouldMemberPay] = useState("NA");
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [errorWithMessage, setErrorWithMessage] = useState({
    value: "NA",
    message: "",
  });
  const history = useHistory();
  const toast = useToast();
  const location = useLocation();

  useEffect(() => {
    checkIfMemberShouldPay();
    setMonthlyAmount(location.maintenanceAmount);
  }, []);

  useEffect(() => {
    if (shouldMemberPay === true) fetchPaymentDetails();
  }, [shouldMemberPay]);

  useEffect(() => {
    if (isValidMember === true)
      authAxios()
        .post(`/api/payments/hash/generate/${getMemberDetails().memberId}`, {})
        .then((response) => {
          setReqBodyBolt({
            ...response.data,
          });
          setPayButtonActive(true);
        });
  }, [isValidMember]);

  const checkIfMemberShouldPay = async () => {
    try {
      const result = await authAxios().get(
        `/api/members/payment/check/${getMemberDetails().memberId}`
      );

      setShouldMemberPay(result.data.shouldMemberPay);
    } catch (err) {
      console.log("Error occured while checking if member should pay", err);
      throw new Error("Error occured while checking if member should pay");
    }
  };

  const fetchPaymentDetails = async () => {
    const memberId = getMemberDetails().memberId;
    try {
      const paymentDetails = await authAxios().get(
        `/api/members/payment/${memberId}`
      );
      if (paymentDetails.data.data)
        if (paymentDetails.data.data.memberId === memberId) {
          setValidMember(true);
          setPaymentDataArrayState(paymentDetails.data.data);
          setCardLoading(false);
        } else {
          setValidMember(false);
        }
    } catch (err) {
      setErrorWithMessage({ value: true, message: err.response.data.data });
    }
  };

  const contactServer = () => {
    authAxios()
      .post("/api/payments/hash/verify", reqBodyBolt)
      .then((result) => {
        if (result.status === 200) {
          history.push("/member/status/success?status=success");
        } else {
          toast({
            title: "Transaction verification failed",
            description: "Invalid transaction. Hash do not match.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((err) => {
        console.error("Error occured while contacting server", err);
        throw new Error("Error occured while contacting server");
      });
  };

  function launchBolt() {
    window.bolt.launch(reqBodyBolt, {
      responseHandler: function (BOLT) {
        if (BOLT.response.txnStatus === "SUCCESS") {
          contactServer();
        } else if (BOLT.response.txnStatus === "CANCEL") {
          toast({
            title: "User cancelled transaction",
            description: "User cancelled transaction.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Transaction failed",
            description: "Please try again",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      },
      catchException: function (BOLT) {
        alert(BOLT.message);
      },
    });
  }

  const paymentDataArray = [
    {
      index: 1,
      textContent: "January 2021",
      paidStatus: "PAID",
      colorScheme: "green",
    },
    {
      index: 2,
      textContent: "February 2021",
      paidStatus: "PAID",
      colorScheme: "green",
    },
    {
      index: 3,
      textContent: "March 2021",
      paidStatus: "PAID",
      colorScheme: "green",
    },
    {
      index: 4,
      textContent: "April 2021",
      paidStatus: "PAID",
      colorScheme: "green",
    },
  ];

  if (shouldMemberPay === "NA")
    return (
      <Center w="100%">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="teal.500"
          size="xl"
        />
      </Center>
    );
  if (!shouldMemberPay)
    return (
      <Center h="80vh">
        <Text fontSize="2xl">
          You are not subscribed to monthly payment subscription. Contact admin
          for more details.
        </Text>
      </Center>
    );

  if (errorWithMessage.value === true)
    return (
      <Center w="100%">
        <Text p={4}>{errorWithMessage.message}</Text>
      </Center>
    );

  if (!isValidMember) {
    return (
      <Center w="100%">
        <Text>
          Invalid member found while validating the member. This is an
          application error. Please contact admin.
        </Text>
      </Center>
    );
  }

  return (
    <>
      <ReactDependentScript
        loadingComponent={
          <VStack>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="teal.500"
              size="xl"
            />
            Payment page is loading...
          </VStack>
        }
        scripts={["https://checkout-static.citruspay.com/bolt/run/bolt.min.js"]}
      >
        <Box h="100%" minH={{ md: "80vh" }} m={8}>
          <Stack w={{ base: "90%", md: "70%" }} m="auto" spacing={8}>
            <Text>
              Monthly Payment Amount:{" "}
              <Badge colorScheme="teal">₹{monthlyAmount}</Badge>
            </Text>
            <Center>
              <Badge borderRadius={10} colorScheme="orange" p={2}>
                Due for
              </Badge>
            </Center>
            <SimpleGrid minChildWidth="260px" spacing="40px">
              <SimpleCard
                textContent={date.format(
                  new Date(paymentDataArrayState.dueFor),
                  datePattern
                )}
                paidStatus="DUE"
                colorScheme="orange"
                isLoading={isCardLoading}
              />
            </SimpleGrid>
            <Center>
              <Badge borderRadius={10} colorScheme="red" p={2}>
                Overdue for ({paymentDataArrayState.overdueFor.length} months)
              </Badge>
            </Center>
            <SimpleGrid minChildWidth="260px" spacing="40px">
              {paymentDataArrayState.overdueFor.map((item) => (
                <SimpleCard
                  onlyText={!paymentDataArrayState.overdueFor.length}
                  textContent={
                    paymentDataArrayState.overdueFor.length
                      ? date.format(new Date(item), datePattern)
                      : "No payments are overdue"
                  }
                  paidStatus="OVERDUE"
                  colorScheme="red"
                  isLoading={isCardLoading}
                />
              ))}
            </SimpleGrid>
            <Accordion allowMultiple>
              <AccordionItem p={0} m={0}>
                <Center>
                  <AccordionButton
                    _focus="none"
                    w="210px"
                    borderRadius="20px"
                    _hover={{
                      bg: "none",
                    }}
                  >
                    <Box flex="1" textAlign="left">
                      <Badge borderRadius={10} colorScheme="green" p={2}>
                        previous transactions
                      </Badge>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </Center>
                <AccordionPanel px={0} pt={4}>
                  <SimpleGrid column={2} minChildWidth="260px" spacing="40px">
                    {paymentDataArray.map((card) => (
                      <SimpleCard
                        key={card.index}
                        isLoading={isCardLoading}
                        textContent={card.textContent}
                        paidStatus={card.paidStatus}
                        colorScheme={card.colorScheme}
                      />
                    ))}
                  </SimpleGrid>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Center>
              <Skeleton
                my={6}
                startColor="gray.200"
                endColor="orange.400"
                isLoaded={!isCardLoading}
              >
                <Button
                  p={7}
                  onClick={() => launchBolt()}
                  colorScheme="orange"
                  disabled={!isPayButtonActive}
                >
                  Pay Total Due Amount: Rs{" "}
                  {paymentDataArrayState.totalAmountDue}
                </Button>
              </Skeleton>
            </Center>
          </Stack>
        </Box>
      </ReactDependentScript>
    </>
  );
};

const SimpleCard = ({
  textContent,
  onlyText,
  paidStatus,
  colorScheme,
  isLoading,
}) => (
  <Skeleton startColor="gray.200" endColor="teal.400" isLoaded={!isLoading}>
    <Center
      boxShadow="lg"
      borderRadius="20px"
      h="200px"
      p={8}
      bg="gray.100"
      color={`${colorScheme}.800`}
      border="1px solid"
      borderColor={`${colorScheme}.300`}
    >
      <Stack
        direction={{ base: "column", md: "column" }}
        justify="center"
        align="center"
        spacing={4}
      >
        <Text align="center" fontSize={{ base: "xl", md: "2xl" }}>
          {textContent}
        </Text>
        {!onlyText && (
          <>
            <Badge borderRadius={5} colorScheme={colorScheme}>
              {paidStatus}
            </Badge>
          </>
        )}
      </Stack>
    </Center>
  </Skeleton>
);

export default MemberPayment;

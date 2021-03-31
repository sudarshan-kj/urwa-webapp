import React, { useEffect, useReducer, useState } from "react";
import {
  Button,
  Center,
  useToast,
  Spinner,
  VStack,
  Box,
  Icon,
  SimpleGrid,
  Stack,
  Badge,
  Text,
  Skeleton,
} from "@chakra-ui/react";
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
import { ReactComponent as RightIcon } from "assets/icons/right.svg";

const datePattern = date.compile("MMM DD, YYYY");

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT_FETCH":
      return { ...state, isLoading: true, isError: false };
    case "FETCH_SUCCESS":
      return { ...state, isLoading: false, isError: false };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, isError: true };
    default:
      throw new Error("Invalid action type entered:", action.type);
  }
};

const MemberPayment = () => {
  const [paymentData, dispatchPaymentData] = useReducer(reducer, {});
  const [reqBodyBolt, setReqBodyBolt] = useState({});
  const [isPayButtonActive, setPayButtonActive] = useState(false);
  const [isValidMember, setValidMember] = useState("NA");
  const [paymentDataArrayState, setPaymentDataArrayState] = useState({
    overdueFor: [],
    dueFor: "",
    paidFor: [],
    memberId: "",
    paidTill: "2021-08-09",
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

  const contactServer = ({
    hash,
    status,
    amount,
    txnid,
    productinfo,
    firstname,
    email,
  }) => {
    let reqBody = {};
    reqBody.hash = hash;
    reqBody.status = status;
    reqBody.amount = amount;
    reqBody.txnid = txnid;
    reqBody.productinfo = productinfo;
    reqBody.firstname = firstname;
    reqBody.email = email;
    authAxios()
      .post("/api/payments/hash/verify", reqBody)
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
          contactServer(BOLT.response);
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
            <Text textAlign={{ base: "center", md: "left" }} fontSize="xl">
              Monthly Payment Amount:{" "}
              <Badge fontSize="xl" colorScheme="teal">
                ₹{monthlyAmount}
              </Badge>
            </Text>
            {paymentDataArrayState.dueFor ? (
              <>
                <Center>
                  <Badge borderRadius={10} colorScheme="orange" p={2}>
                    Due for
                  </Badge>
                </Center>
                <SimpleGrid minChildWidth="260px" spacing="40px">
                  <SimpleCard
                    mainContent={date.format(
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
                    Overdue for ({paymentDataArrayState.overdueFor.length}{" "}
                    months)
                  </Badge>
                </Center>
                <SimpleGrid minChildWidth="260px" spacing="40px" display="flex">
                  <SimpleCard
                    onlyText={!paymentDataArrayState.overdueFor.length}
                    mainContent={
                      paymentDataArrayState.overdueFor.length
                        ? date.format(
                            new Date(
                              paymentDataArrayState.overdueFor.slice(-1)
                            ),
                            datePattern
                          )
                        : "No payments are overdue"
                    }
                    paidStatus="OVERDUE"
                    colorScheme="red"
                    isLoading={isCardLoading}
                  />
                  {paymentDataArrayState.overdueFor.length > 1 && (
                    <>
                      <Box display="flex" alignItems="center">
                        <Icon as={RightIcon} />
                      </Box>
                      <SimpleCard
                        onlyText={!paymentDataArrayState.overdueFor.length}
                        mainContent={
                          paymentDataArrayState.overdueFor.length
                            ? date.format(
                                new Date(paymentDataArrayState.overdueFor[0]),
                                datePattern
                              )
                            : "No payments are overdue"
                        }
                        paidStatus="OVERDUE"
                        colorScheme="red"
                        isLoading={isCardLoading}
                      />
                    </>
                  )}
                </SimpleGrid>
                {/* <Accordion allowMultiple>
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
                      <SimpleGrid
                        column={2}
                        minChildWidth="260px"
                        spacing="40px"
                      >
                        {paymentDataArray.map((card) => (
                          <SimpleCard
                            key={card.index}
                            isLoading={isCardLoading}
                            mainContent={card.mainContent}
                            paidStatus={card.paidStatus}
                            colorScheme={card.colorScheme}
                          />
                        ))}
                      </SimpleGrid>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion> */}
              </>
            ) : (
              !isCardLoading && (
                <>
                  <InfoCard
                    mainContent="Good to go 👍"
                    infoText1=" You have no pending dues!"
                    colorScheme="green"
                    infoText2={
                      paymentDataArrayState.paidFor && (
                        <p>
                          Your next due is on{" "}
                          {date.format(
                            new Date(paymentDataArrayState.paidTill),
                            datePattern
                          )}
                        </p>
                      )
                    }
                  />
                </>
              )
            )}
          </Stack>
        </Box>
      </ReactDependentScript>
      {paymentDataArrayState.totalAmountDue > 0 && (
        <Center pos="fixed" bottom="0" left="0" right="0">
          <Skeleton
            w="100%"
            startColor="gray.200"
            endColor="orange.400"
            isLoaded={!isCardLoading}
          >
            <Button
              w="100%"
              p={10}
              fontSize="xl"
              onClick={() => launchBolt()}
              borderRadius="0"
              colorScheme="teal"
              disabled={!isPayButtonActive}
            >
              Pay Total Due Amount: ₹ {paymentDataArrayState.totalAmountDue}
            </Button>
          </Skeleton>
        </Center>
      )}
    </>
  );
};

const InfoCard = ({ mainContent, infoText1, infoText2, colorScheme }) => (
  <Center
    boxShadow="lg"
    borderRadius="20px"
    h={{ base: "60vh", md: "70vh" }}
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
      <Text align="center" fontSize={{ base: "3xl", md: "5xl" }}>
        {mainContent}
      </Text>
      <Text align="center" fontSize={{ base: "2xl", md: "4xl" }}>
        {infoText1}
      </Text>
      <Badge p={4} colorScheme="green" fontSize={{ base: "sm", md: "2xl" }}>
        {infoText2}
      </Badge>
    </Stack>
  </Center>
);

const SimpleCard = ({
  mainContent,
  height,
  onlyText,
  paidStatus,
  colorScheme,
  isLoading,
}) => (
  <Skeleton startColor="gray.200" endColor="teal.400" isLoaded={!isLoading}>
    <Center
      boxShadow="lg"
      borderRadius="20px"
      h={height || "200px"}
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
          {mainContent}
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

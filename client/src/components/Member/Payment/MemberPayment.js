import React from "react";
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
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import ReactDependentScript from "react-dependent-script";
import config from "../../../config";
import { useHistory } from "react-router-dom";
import { authAxios } from "utils/Auth";

const MemberPayment = () => {
  const [hash, setHash] = React.useState();
  const history = useHistory();
  const toast = useToast();

  const reqBody = {
    txnid: "ORD680",
    hash: hash,
    amount: 1,
    firstname: "Test",
    email: "test@gmail.com",
    phone: "9686678568",
    productinfo: "P01,P02",
    udf5: "BOLT_KIT_NODE_JS",
    surl: "https://www.google.com",
    furl: "https://www.bing.com",
    service_provider: "payu_paisa",
  };

  React.useEffect(() => {
    authAxios()
      .post("/api/payments/hash/generate", reqBody)
      .then((response) => console.log("Response is", response.data));
  }, []);

  const contactServer = () => {
    authAxios()
      .post(
        `${config.API_ENDPOINT}/api/members/5fd0724838599421a8daf8f1/payment`,
        reqBody
      )
      .then((result) => {
        if (result.status === 200) {
          history.push("/member/status/success?status=success");
        } else {
          toast({
            title: "Transaction authentication failed",
            description: "Invalid transaction",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((err) => {
        console.log("Error occured while contacting server", err);
        throw new Error("Error occured while contacting server");
      });
  };

  function launchBolt() {
    window.bolt.launch(reqBody, {
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
        }
      },
      catchException: function (BOLT) {
        alert(BOLT.message);
      },
    });
  }

  const paymentDataArray = [
    {
      link: "#",
      textContent: "January 2021",
      paidStatus: "PAID",
      colorScheme: "green",
    },
    {
      link: "#",
      textContent: "February 2021",
      paidStatus: "PAID",
      colorScheme: "green",
    },
    {
      link: "#",
      textContent: "March 2021",
      paidStatus: "PAID",
      colorScheme: "green",
    },
    {
      link: "#",
      textContent: "April 2021",
      paidStatus: "OVERDUE",
      colorScheme: "red",
    },
    {
      link: "#",
      textContent: "May 2021",
      paidStatus: "OVERDUE",
      colorScheme: "red",
    },
    {
      link: "#",
      textContent: "June 2021",
      paidStatus: "DUE",
      colorScheme: "orange",
    },
  ];

  return (
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
      {/* <Center h="80vh">
        <Heading>Due amount is Rs 300</Heading>
        <Button onClick={() => launchBolt()}> Pay</Button>
      </Center> */}
      <Box h={{ base: "100%", md: "80vh" }} m={8}>
        <Stack w="80%" m="auto" spacing={8}>
          <SimpleGrid column={2} minChildWidth="260px" spacing="40px">
            {paymentDataArray.map((card) => (
              <SimpleCard
                link={card.link}
                textContent={card.textContent}
                paidStatus={card.paidStatus}
                colorScheme={card.colorScheme}
                launchBolt={launchBolt}
              />
            ))}
          </SimpleGrid>
        </Stack>
      </Box>
    </ReactDependentScript>
  );
};

const SimpleCard = ({
  link,
  textContent,
  paidStatus,
  colorScheme,
  launchBolt,
}) => (
  <Link to={link}>
    <Center
      shadow="xl"
      borderRadius="20px"
      h="200px"
      p={8}
      bg="gray.100"
      _hover={{
        border: "2px solid",
        borderColor: "teal.300",
      }}
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
        <Badge colorScheme={colorScheme}>{paidStatus}</Badge>
        {paidStatus.includes("DUE") ? (
          <Button onClick={() => launchBolt()} colorScheme="teal">
            Pay Now
          </Button>
        ) : (
          <></>
        )}
      </Stack>
    </Center>
  </Link>
);

export default MemberPayment;

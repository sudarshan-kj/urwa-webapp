import React from "react";
import { Button, Center, Heading, useToast } from "@chakra-ui/react";
import ReactDependentScript from "react-dependent-script";
import config from "../../../config";
import { useHistory } from "react-router-dom";
import { authAxios } from "utils/Auth";

const MemberPayment = () => {
  const history = useHistory();
  const toast = useToast();

  const reqBody = {
    key: "Uc6eLUa1",
    txnid: "ORD680",
    hash:
      "69e6ea0f911d77eb9b597c75866cb3a44195b97cc44a89dab447b3cd5eaa175f648b4f5fe7594ea5058373ae3eb53c698aae601ac8cd3f422f31424a85ca5633",
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

  return (
    <ReactDependentScript
      loadingComponent={<div>jQuery is loading...</div>}
      scripts={["https://checkout-static.citruspay.com/bolt/run/bolt.min.js"]}
    >
      <Center h="80vh">
        <Heading>Due amount is Rs 300</Heading>
        <Button onClick={() => launchBolt()}> Pay</Button>
      </Center>
    </ReactDependentScript>
  );
};

export default MemberPayment;

import React from "react";
import { Button, Center, Heading } from "@chakra-ui/react";
import axios from "axios";
import useScript from "hooks/useScript";

const MemberPayment = () => {
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

  function launchBolt() {
    bolt.launch(reqBody, {
      responseHandler: function (BOLT) {
        console.log(BOLT.response.txnStatus);
        if (BOLT.response.txnStatus != "CANCEL") {
        }
      },
      catchException: function (BOLT) {
        alert(BOLT.message);
      },
    });
  }

  const handlePay = () => {
    axios
      .post("https://sboxcheckout.citruspay.com/payu/icpcheckout", reqBody)
      .then((result) => console.log(result))
      .catch((err) => console.log("Error caught", err));
  };

  return (
    <Center h="80vh">
      <Heading>Due amount is Rs 300</Heading>
      <Button onClick={() => launchBolt()}> Pay</Button>
    </Center>
  );
};

export default MemberPayment;

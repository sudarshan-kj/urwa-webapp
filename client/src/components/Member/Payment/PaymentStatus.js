import React from "react";
import { useLocation } from "react-router-dom";

const PaymentStatus = () => {
  const location = useLocation();
  console.log("Locations is", location.search.slice(1).split("=")[1]);
  return <h1>Payment Successful</h1>;
};

export default PaymentStatus;

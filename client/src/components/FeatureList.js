import React from "react";
import { Box, Stack, Heading, VStack, Badge } from "@chakra-ui/react";

const FeatureList = () => (
  <>
    <Stack bg="gray.200" h="100vh" w="50%" m="auto" p={20} spacing={20}>
      <VStack spacing={10} border="1px solid black" p={8}>
        <Heading>Admin features</Heading>
        <ul>
          <li>
            Can <Badge>ADD</Badge>,<Badge> UPDATE</Badge>,<Badge>DELETE</Badge>
            Member
          </li>
          <li>
            Can <Badge>View all</Badge> members
          </li>
          <li>
            <Badge colorScheme="red">Cannot</Badge> create new Admins
          </li>
          <li>
            Can update fields like: <Badge>email address</Badge>,{" "}
            <Badge>maintenance amount</Badge>,
            <Badge>membership start date</Badge> for any member
          </li>
          <li>
            Please refer to the <Badge>hints</Badge> below input fields while
            adding new members
          </li>
          <li>All the fields are mandatory. No field can be left blank.</li>
          <li>
            Since an Admin is also a member, his payments are also tracked.
          </li>
          <li>
            Can look at self amount dues, overdues and previous transactions
            from 'My Payments' page
          </li>
          <li>
            Can pay self <Badge>due</Badge> and <Badge>overdue</Badge> amounts.
          </li>
          <li>
            Can pay self <Badge>Total Due amount</Badge>
          </li>
          <li>
            <Badge colorScheme="red">Cannot</Badge> pay on behalf
          </li>
        </ul>
      </VStack>
      <VStack spacing={10} border="1px solid black" p={8}>
        <Heading>Member features</Heading>
        <ul>
          <li>
            Can <Badge>VIEW</Badge> and <Badge>UPDATE</Badge> their profile
          </li>
          <li>
            <Badge colorScheme="red">Cannot</Badge> update unauthorized fields
            like: <Badge>email address</Badge>,<Badge>maintenance amount</Badge>
            ,<Badge>membership start date</Badge> <br></br>for self or any other
            member
          </li>
          <li>
            Can look at amount dues, overdues and previous transactions from 'My
            Payments' page
          </li>
          <li>
            Can pay <Badge>due</Badge> and <Badge>overdue</Badge> amounts.
          </li>
          <li>
            Can pay <Badge>Total Due amount</Badge>
          </li>
        </ul>
      </VStack>
      <VStack spacing={10} border="1px solid black" p={8}>
        <Heading>Generic notes</Heading>
        <ul>
          <li>Use email id only to login to account</li>
          <li>
            Email id is <Badge>not</Badge> case sensitive
          </li>
          <li>
            While adding a new member, if password is left blank, an auto
            generated password will become effective, <br></br>which is of the
            form <Badge>[siteNumber][firstName]</Badge>
          </li>
          <li>
            Membership start date dictates from when the monthly reminders pop
            up in member's account. <br></br>If membership start date is 1st
            January 2021, monthly reminders will start from 1st Feb 2021
          </li>
          <li>Site Number should be unique</li>
          <li>Email id should be unique</li>
          <li>
            The same email id cannot have 2 site numbers. Will have to update
            this, if that is the requirement
          </li>
        </ul>
      </VStack>
    </Stack>
  </>
);

export default FeatureList;

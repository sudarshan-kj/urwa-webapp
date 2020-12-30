import React from "react";
import { Center, Box, SimpleGrid } from "@chakra-ui/react";
import SimpleHomeCard from "components/commons/SimpleHomeCard";

const Home = ({ data }) => {
  return (
    //144px since the header is 80px. Padding is 32px on top, so 64px on y axis. Hence, 80+64 = 144
    <Center minH={"calc(100vh - 144px)"} w="60%" m="auto">
      <SimpleGrid
        w="100%"
        minChildWidth={{ base: "160px", md: "320px" }}
        spacing="40px"
      >
        {data.map((card) => (
          <SimpleHomeCard
            link={card.link}
            textContent={card.textContent}
            icon={card.icon}
            metaData={card.metaData ? card.metaData : ""}
          />
        ))}
      </SimpleGrid>
    </Center>
  );
};

export default Home;

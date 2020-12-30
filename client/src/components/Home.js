import React from "react";
import { Center, Box, SimpleGrid } from "@chakra-ui/react";
import SimpleHomeCard from "components/commons/SimpleHomeCard";

const Home = ({ data }) => {
  return (
    <Box h={"calc(90vh - 80px)"} w="100%">
      <Center h="100%" w="60%" m="auto">
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
    </Box>
  );
};

export default Home;

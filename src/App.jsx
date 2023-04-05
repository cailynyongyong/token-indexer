import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Text,
  Card,
  CardHeader,
  CardBody,
  Container,
} from "@chakra-ui/react";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import { useState } from "react";

function App() {
  const [userAddress, setUserAddress] = useState("");
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getTokenBalance() {
    setLoading(true);
    const config = {
      apiKey: "Zdzh4yYBpiLnFKG7NayO1tkZdWgwSOFY",
      network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(config);
    const data = await alchemy.core.getTokenBalances(userAddress);
    console.log(userAddress);
    // console.log(data);

    const tokenDataPromises = [];

    for (let i = 0; i < data.tokenBalances.length; i++) {
      const tokenData = alchemy.core.getTokenMetadata(
        data.tokenBalances[i].contractAddress
      );
      tokenDataPromises.push(tokenData);
      console.log(tokenData);
    }
    console.log(await Promise.all(tokenDataPromises));
    setTokenDataObjects(await Promise.all(tokenDataPromises));
    setResults(data);

    setHasQueried(true);
    setLoading(false);
  }
  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        console.log("connecting");
        await ethereum
          .request({ method: "eth_requestAccounts" })
          .then((res) => {
            // Return the address of the wallet
            console.log(res[0]);
            setUserAddress(res[0]);
          });
      } catch (error) {
        console.log(error);
      }
      // const accounts = await ethereum.request({ method: "eth_accounts" });
    } else {
      alert("Please install Metamask!");
      //document.getElementById("login_button").innerHTML = "Please install MetaMask";
    }
  }
  return (
    <Box w="100vw">
      <Center>
        <Flex
          alignItems={"center"}
          justifyContent="center"
          flexDirection={"column"}
        >
          <Heading>ERC-20 Token Indexer</Heading>
          <Text>
            Plug in an address and this website will return all of its ERC-20
            token balances!
          </Text>
        </Flex>
      </Center>
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent={"center"}
      >
        <Heading>Get all the ERC-20 token balances of this address:</Heading>
        <Input
          size={"sm"}
          defaultValue={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          color="black"
          w="600px"
          textAlign="center"
          p={4}
          bgColor="white"
          fontSize={24}
        />
        <Button colorScheme="blue" onClick={connect}>
          Connect Metamask Wallet
        </Button>
        <Button
          colorScheme="blue"
          onClick={getTokenBalance}
          isLoading={loading}
          loadingText="Checking..."
        >
          Check ERC-20 Token Balances
        </Button>

        <Heading>ERC-20 token balances:</Heading>

        {hasQueried ? (
          <SimpleGrid w={"90vw"} columns={4} spacing={24}>
            {results.tokenBalances.map((e, i) => {
              return (
                <Flex flexDir={"column"} color="white" w={"20vw"} key={e.id}>
                  <Card>
                    <CardHeader>
                      <Heading size="md">
                        ${tokenDataObjects[i]?.symbol}&nbsp;
                      </Heading>
                    </CardHeader>
                    <CardBody>
                      <Image
                        src={tokenDataObjects[i].logo}
                        fallbackSrc="https://via.placeholder.com/70"
                        borderRadius={"lg"}
                      />
                      <b>Balance:</b>&nbsp;
                      {Utils.formatUnits(
                        e.tokenBalance,
                        tokenDataObjects[i].decimals
                      )}
                    </CardBody>
                  </Card>
                </Flex>
              );
            })}
          </SimpleGrid>
        ) : (
          "Please make a query! This may take a few seconds..."
        )}
      </Flex>
    </Box>
  );
}

export default App;

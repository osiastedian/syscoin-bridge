import { Box, Button, Container, Grid, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import WalletList from "../components/WalletList";
import { useConnectedWallet } from "../contexts/ConnectedWallet/useConnectedWallet";
import HomeHowItWorks from "components/Home/HowItWorks";
import ContactUs from "components/Home/ContactUs";
import FAQ from "components/Home/FAQ";
import Footer from "components/Footer";
import { usePaliWalletV2 } from "@contexts/PaliWallet/usePaliWallet";
import NextImage from "next/image";
import { useEffect, useState } from "react";

const PaliAndMetamaskBridge = () => {
  const [isReady, setIsReady] = useState(false);
  const { nevm, utxo } = useConnectedWallet();

  useEffect(() => {
    setIsReady(Boolean(nevm.account) && Boolean(utxo.account));
  }, [nevm.account, utxo.account]);
  return (
    <>
      <WalletList />
      {isReady && (
        <Box display="flex" justifyContent="space-between">
          <Link href={`/bridge/${Date.now()}`}>
            <Button variant="contained">
              Continue
              <ArrowForwardIcon />
            </Button>
          </Link>
          <Link href={`/transfers`}>
            <Button variant="text" color="secondary">
              View My Transfers
            </Button>
          </Link>
        </Box>
      )}
    </>
  );
};

const PaliV2Bridge = () => {
  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Link href={`/bridge/v3/sys-to-nevm`}>
          <Button variant="contained">
            Go to PaliV2 Bridge
            <ArrowForwardIcon />
          </Button>
        </Link>
        <Link href={`/transfers/v2`}>
          <Button variant="text" color="secondary">
            View My Transfers
          </Button>
        </Link>
      </Box>
    </>
  );
};

const Home: NextPage = () => {
  const { isInstalled, version, isEVMInjected } = usePaliWalletV2();

  const isPaliVersion2 =
    isInstalled && version && version === "v2" && isEVMInjected;

  return (
    <Box>
      <Head>
        <title>Syscoin Bridge</title>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="description" content="Syscoin Trustless Bridge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box component="main">
        <Grid component={Container} container sx={{ my: 3, maxWidth: null }}>
          <Grid item md={12}>
            <Grid component={Container} container sx={{ my: 3 }}>
              <Grid item md={6}>
                <Box>
                  <NextImage
                    className="animation"
                    src="/bridge-diagram.svg"
                    width={258}
                    height={258}
                    alt="Syscoin Bridge Diagram"
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                  />
                </Box>
              </Grid>
              <Grid item md={6} sx={{ my: "auto", padding: 2 }}>
                <Typography variant="h2" fontWeight="bold">
                  SYSCOIN BRIDGE
                </Typography>
                <Typography variant="h6" sx={{ mb: 4 }}>
                  Transfer SYS back and forth between the Syscoin and NEVM
                  Blockchain
                </Typography>
                {isPaliVersion2 ? <PaliV2Bridge /> : <PaliAndMetamaskBridge />}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Container>
          <HomeHowItWorks />
        </Container>
        <Box component={FAQ} mb={3} />
        <Box component={ContactUs} mb={3} />
      </Box>

      <Footer />
    </Box>
  );
};

export default Home;

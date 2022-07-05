import { Box, Button, Container, Grid, Typography, Link } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useConnectedWallet } from "../contexts/ConnectedWallet/useConnectedWallet";
import WalletList from "../components/WalletList";
import { Link as RouterLink } from "react-router-dom";
import HomeHowItWorks from "../components/Home/HowItWorks";
import FAQ from "../components/Home/FAQ";
import ContactUs from "../components/Home/ContactUs";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  const { availableWallets } = useConnectedWallet();

  const isReady = availableWallets.paliWallet && availableWallets.metamask;

  return (
    <Box>
      <Box component="main">
        <Grid component={Container} container sx={{ my: 3 }}>
          <Grid item md={6}>
            <Box>
              <img
                width={"100%"}
                height={"720px"}
                alt="bridge animation"
                src="/bridge-diagram.svg"
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
            <WalletList />
            {isReady && (
              <Box display="flex" justifyContent="space-between">
                <Link component={RouterLink} to={`/bridge/${Date.now()}`}>
                  <Button variant="contained">
                    Continue
                    <ArrowForwardIcon />
                  </Button>
                </Link>
                <Link component={RouterLink} to={`/transfers`}>
                  <Button variant="text" color="secondary">
                    View My Transfers
                  </Button>
                </Link>
              </Box>
            )}
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

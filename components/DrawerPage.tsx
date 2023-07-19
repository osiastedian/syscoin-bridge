import { Box, Drawer, styled, Typography } from "@mui/material";
import Navigation from "./Navigation/Navigation";
import { INavigationItem } from "./Navigation/Item";
const drawerWidth = "12rem";

const Nav = styled(Box)({
  width: drawerWidth,
});

const Main = styled(Box)({
  width: `calc(100% - ${drawerWidth})`,
});

type DrawerPageProps = {
  children: React.ReactNode;
  routes: INavigationItem[];
};

const DrawerPage: React.FC<DrawerPageProps> = ({ children, routes }) => {
  return (
    <Box display="flex">
      <Nav component="nav">
        <Drawer
          variant="permanent"
          open
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <Typography variant="h6" color="primary.white" sx={{ p: 2 }}>
            Syscoin Bridge
          </Typography>
          <Navigation items={routes} />
        </Drawer>
      </Nav>
      <Main component="main">{children}</Main>
    </Box>
  );
};

export default DrawerPage;

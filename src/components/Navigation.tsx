import { List, ListItem, ListItemButton, ListItemText, Link } from "@mui/material";

import { Link as RouterLink, useLocation } from "react-router-dom";

interface INavigationItem {
  label: string;
  path: string;
}

const NavigationItem: React.FC<INavigationItem> = ({ label, path }) => {
  const { pathname } = useLocation();
  return (
    <ListItem disablePadding>
      <Link component={RouterLink} to={path}>
        <ListItemButton
          sx={
            pathname.startsWith(path)
              ? {
                  backgroundColor: "primary.dark",
                  color: "white",
                }
              : undefined
          }
        >
          <ListItemText primary={label} />
        </ListItemButton>
      </Link>
    </ListItem>
  );
};

const Navigation: React.FC = () => {
  const routes: INavigationItem[] = [
    {
      label: "My Transfers",
      path: "/transfers",
    },
    {
      label: "FAQ",
      path: "/#faq",
    },
  ];

  return (
    <List>
      {routes.map((route) => (
        <NavigationItem key={route.path} {...route} />
      ))}
    </List>
  );
};

export default Navigation;

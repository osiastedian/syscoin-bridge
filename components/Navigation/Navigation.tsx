import { useConnectedWallet } from "@contexts/ConnectedWallet/useConnectedWallet";
import { List } from "@mui/material";
import NavigationItem, { INavigationItem } from "./Item";

type NavigationProps = {
  items: INavigationItem[];
};

const Navigation: React.FC<NavigationProps> = ({ items }) => {
  return (
    <List>
      {items.map((route) => (
        <NavigationItem key={route.path} {...route} />
      ))}
    </List>
  );
};

export default Navigation;

import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

export interface INavigationItem {
  label: string;
  path: string;
}

const NavigationItem: React.FC<INavigationItem> = ({ label, path }) => {
  const { asPath } = useRouter();
  return (
    <ListItem disablePadding>
      <Link href={path} style={{ width: "100%" }}>
        <ListItemButton
          sx={
            asPath.startsWith(path)
              ? {
                  backgroundColor: "primary.dark",
                  color: "white",
                }
              : {
                  color: "primary.main",
                }
          }
        >
          <ListItemText primary={label} />
        </ListItemButton>
      </Link>
    </ListItem>
  );
};

export default NavigationItem;

import { ITransfer } from "@contexts/Transfer/types";
import { Button, Container, Typography } from "@mui/material";
import { AdminLayoutContainer } from "components/Admin/LayoutContainer";
import dbConnect from "lib/mongodb";
import { GetServerSideProps, NextPage } from "next";
import TransferModel from "models/transfer";
import { ArrowCircleLeft } from "@mui/icons-material";
import Link from "next/link";
import MuiLink from "@mui/material/Link";

type Props = {
  transfer: ITransfer;
};

const TransferDetailsPage: NextPage<Props> = ({ transfer }) => {
  return (
    <AdminLayoutContainer>
      <Container>
        <Button LinkComponent={Link} href="/admin">
          <ArrowCircleLeft />
          Back to Transfer List
        </Button>
        <Typography variant="h6">#{transfer.id}</Typography>
        <Typography variant="body1">
          NEVM Address:
          <MuiLink
            href={`https://explorer.syscoin.org/address/${transfer.nevmAddress}`}
            target="_blank"
            sx={{ ml: 2 }}
          >
            {transfer.nevmAddress}
          </MuiLink>
        </Typography>
        <Typography variant="body1">
          UTXO Address:
          <MuiLink
            href={`https://blockbook.elint.services/address/${transfer.utxoAddress}`}
            target="_blank"
            sx={{ ml: 2 }}
          >
            {transfer.utxoAddress}
          </MuiLink>
        </Typography>
      </Container>
    </AdminLayoutContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params) {
    return {
      notFound: true,
    };
  }

  const id = params["id"];

  if (!id) {
    return {
      notFound: true,
    };
  }

  await dbConnect();

  const transfer = await TransferModel.findOne({ id });

  if (!transfer) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      transfer: JSON.parse(JSON.stringify(transfer)),
    },
  };
};

export default TransferDetailsPage;

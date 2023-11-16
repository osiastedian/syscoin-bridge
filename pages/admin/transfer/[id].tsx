import { ITransfer, TransferStatus } from "@contexts/Transfer/types";
import { Box, Button, Container, Typography } from "@mui/material";
import { AdminLayoutContainer } from "components/Admin/LayoutContainer";
import dbConnect from "lib/mongodb";
import { GetServerSideProps, NextPage } from "next";
import TransferModel from "models/transfer";
import { ArrowCircleLeft } from "@mui/icons-material";
import Link from "next/link";
import MuiLink from "@mui/material/Link";
import { FormProvider, useForm } from "react-hook-form";
import AdminTransferStatusSelect from "components/Admin/Transfer/StatusField";
import { useNEVM } from "@contexts/ConnectedWallet/NEVMProvider";

type Props = {
  transfer: ITransfer;
};

const TransferDetailsPage: NextPage<Props> = ({ transfer }) => {
  const { signMessage } = useNEVM();
  const form = useForm({
    mode: "all",
    defaultValues: {
      status: transfer.status,
    },
  });

  const {
    handleSubmit,
    formState: { isDirty, isValid },
  } = form;

  const onSubmit = async (data: { status: TransferStatus }) => {
    const hexString = `0x${Buffer.from(JSON.stringify(data), "utf8").toString(
      "hex"
    )}`;
    signMessage(hexString).then((signedMessage) => {
      console.log(signedMessage);
    });
  };
  return (
    <AdminLayoutContainer>
      <Container>
        <Button LinkComponent={Link} href="/admin">
          <ArrowCircleLeft />
          Back to Transfer List
        </Button>
        <Typography variant="h6">#{transfer.id}</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          NEVM Address:
          <MuiLink
            href={`https://explorer.syscoin.org/address/${transfer.nevmAddress}`}
            target="_blank"
            sx={{ ml: 2 }}
          >
            {transfer.nevmAddress}
          </MuiLink>
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          UTXO Address:
          <MuiLink
            href={`https://blockbook.elint.services/address/${transfer.utxoAddress}`}
            target="_blank"
            sx={{ ml: 2 }}
          >
            {transfer.utxoAddress}
          </MuiLink>
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <FormProvider {...form}>
            <AdminTransferStatusSelect transfer={transfer} />
          </FormProvider>
          <Button
            sx={{ display: "block" }}
            variant="contained"
            type="submit"
            disabled={!isDirty || !isValid}
          >
            Update
          </Button>
        </Box>
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

  const transfer = await TransferModel.findOne(
    { id },
    { id: 1, nevmAddress: 1, utxoAddress: 1, status: 1, type: 1 }
  );

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

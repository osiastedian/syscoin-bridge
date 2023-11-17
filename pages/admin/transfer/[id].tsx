import { ITransfer } from "@contexts/Transfer/types";
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
import { formatRelative } from "date-fns";
import { Change, OverrideTransferRequestBody } from "api/types/admin";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  initialTransfer: ITransfer;
};

type FormValues = Pick<ITransfer, "status">;

const TransferDetailsPage: NextPage<Props> = ({ initialTransfer }) => {
  const { signMessage } = useNEVM();
  const [transfer, setTransfer] = useState(initialTransfer);

  const form = useForm<FormValues>({
    mode: "all",
    defaultValues: {
      status: transfer.status,
    },
  });

  const {
    handleSubmit,
    formState: { isDirty, isValid },
  } = form;

  const onUpdate = (signedMessage: string, changes: Change[]) => {
    const body: OverrideTransferRequestBody = {
      signedMessage,
      changes,
    };
    fetch(`/api/admin/transfer/${transfer.id}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((updatedTransfer) => {
        setTransfer(updatedTransfer);
        form.reset({
          status: updatedTransfer.status,
        });
      });
  };

  const onSubmit = async (data: FormValues) => {
    const changes: Change[] = [];
    Object.keys(data).forEach((key) => {
      const transferKey = key as keyof FormValues;
      if (transfer[transferKey] !== data[transferKey]) {
        changes.push({
          property: transferKey,
          from: transfer[transferKey],
          to: data[transferKey],
        });
      }
    });
    const hexString = `0x${Buffer.from(
      JSON.stringify(changes),
      "utf8"
    ).toString("hex")}`;
    signMessage(hexString).then((signedMessage) => {
      return onUpdate(signedMessage, changes);
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
        <Typography variant="body1" sx={{ mb: 2 }}>
          Created: {formatRelative(new Date(transfer.createdAt), new Date())}
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
    { id: 1, nevmAddress: 1, utxoAddress: 1, status: 1, type: 1, createdAt: 1 }
  );

  if (!transfer) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      initialTransfer: JSON.parse(JSON.stringify(transfer)),
    },
  };
};

export default TransferDetailsPage;

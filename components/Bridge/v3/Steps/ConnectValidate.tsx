import { usePaliWalletV2 } from "@contexts/PaliWallet/usePaliWallet";
import { CheckCircleOutline, CloseOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTransfer } from "../context/TransferContext";
import BridgeV3Loading from "../Loading";
import {
  isValidEthereumAddress,
  isValidSYSAddress,
} from "@pollum-io/sysweb3-utils";
import UTXOConnect from "components/Bridge/WalletSwitchV2/UTXOConnect";
import NEVMConnect from "components/Bridge/WalletSwitchV2/NEVMConnect";
import { useNevmBalance, useUtxoBalance } from "utils/balance-hooks";
import { ITransfer, TransferStatus } from "@contexts/Transfer/types";
import { useRouter } from "next/router";
import NextLink from "next/link";
import CompareArrows from "@mui/icons-material/CompareArrows";

const ErrorMessage = ({ message }: { message: string }) => (
  <Box sx={{ display: "flex", mb: 2 }}>
    <Typography variant="body1" color="error">
      {message}
    </Typography>
    <CloseOutlined color="error" />
  </Box>
);

type ConnectValidateFormData = {
  amount: number;
  nevmAddress: string;
  utxoAddress: string;
  utxoXpub: string;
};

type BridgeV3ConnectValidateStepProps = {
  successStatus: TransferStatus;
};

const BridgeV3ConnectValidateStep: React.FC<
  BridgeV3ConnectValidateStepProps
> = ({ successStatus }) => {
  const { replace } = useRouter();
  const { transfer, isSaving, saveTransfer } = useTransfer();
  const { isLoading } = usePaliWalletV2();
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<ConnectValidateFormData>({
    mode: "all",
    values: {
      amount: 0.1,
      nevmAddress: "",
      utxoAddress: "",
      utxoXpub: "",
    },
  });

  const utxoAddress = watch("utxoAddress");
  const utxoXpub = watch("utxoXpub");
  const nevmAddress = watch("nevmAddress");
  const minAmount = 0.01;

  const utxoBalance = useUtxoBalance(utxoXpub);
  const nevmBalance = useNevmBalance(nevmAddress);

  const isUtxoNotEnoughGas =
    Boolean(utxoXpub) &&
    utxoBalance.isFetched &&
    utxoBalance.data !== undefined &&
    utxoBalance.data < minAmount;

  const isNevmNotEnoughGas =
    Boolean(nevmAddress) &&
    nevmBalance.isFetched &&
    nevmBalance.data !== undefined &&
    nevmBalance.data < minAmount;

  const balance =
    transfer.type === "sys-to-nevm" ? utxoBalance.data : nevmBalance.data;

  let maxAmountCalculated = parseFloat(`${balance ?? "0"}`) - minAmount;

  if (maxAmountCalculated < 0) {
    maxAmountCalculated = 0;
  }

  const modifiedTransfer = { ...transfer, utxoAddress, utxoXpub, nevmAddress };

  const isUtxoValid = isValidSYSAddress(utxoAddress, 57) && !isUtxoNotEnoughGas;
  const isNevmValid =
    isValidEthereumAddress(nevmAddress) && !isNevmNotEnoughGas;
  const isAmountValid = errors.amount === undefined;
  const balanceFetched = utxoBalance.isFetched && nevmBalance.isFetched;
  const isReady = isUtxoValid && isNevmValid && isAmountValid && balanceFetched;

  const onSubmit: SubmitHandler<ConnectValidateFormData> = (data) => {
    const { amount, ...rest } = data;
    const modifiedTransfer: ITransfer = {
      ...transfer,
      amount: amount.toString(),
      ...rest,
      status: successStatus,
    };
    saveTransfer(modifiedTransfer, {
      onSuccess: (transfer) => {
        replace(`/bridge/v3/${transfer.id}`);
      },
    });
  };

  if (isLoading) {
    return <BridgeV3Loading />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>From</strong> Syscoin{" "}
          {transfer.type === "sys-to-nevm" ? "UTXO" : "NEVM"}:
        </Typography>
        {transfer.type === "sys-to-nevm" ? (
          <UTXOConnect
            transfer={modifiedTransfer}
            setUtxo={({ address, xpub }) => {
              setValue("utxoAddress", address);
              setValue("utxoXpub", xpub);
            }}
          />
        ) : (
          <NEVMConnect
            transfer={modifiedTransfer}
            setNevm={({ address }) => {
              setValue("nevmAddress", address);
            }}
          />
        )}
      </Box>
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>To</strong> Syscoin{" "}
          {transfer.type === "nevm-to-sys" ? "UTXO" : "NEVM"}:
        </Typography>
        {transfer.type === "nevm-to-sys" ? (
          <UTXOConnect
            transfer={modifiedTransfer}
            setUtxo={({ address, xpub }) => {
              setValue("utxoAddress", address);
              setValue("utxoXpub", xpub);
            }}
          />
        ) : (
          <NEVMConnect
            transfer={modifiedTransfer}
            setNevm={({ address }) => {
              setValue("nevmAddress", address);
            }}
          />
        )}
      </Box>
      <TextField
        label="Amount"
        placeholder="0.1"
        margin="dense"
        inputProps={{ inputMode: "numeric", pattern: "[0-9]+(.?[0-9]+)?" }}
        InputProps={{
          endAdornment: <InputAdornment position="end">SYS</InputAdornment>,
        }}
        {...register("amount", {
          valueAsNumber: true,
          max: {
            value: maxAmountCalculated,
            message: `You can transfer up to ${maxAmountCalculated.toFixed(
              4
            )} SYS`,
          },
          min: {
            value: minAmount,
            message: `Amount must be at least ${minAmount}`,
          },
          required: {
            message: "Amount is required",
            value: true,
          },
          validate: (value) => (isNaN(value) ? "Must be a number" : undefined),
        })}
        disabled={balance === undefined}
        error={!!errors.amount}
        helperText={<>{errors.amount && errors.amount.message}</>}
        sx={{ mb: 2 }}
      />
      {isReady && (
        <Box sx={{ display: "flex", mb: 2 }}>
          <Typography variant="body1">
            All clear! You are ready to start the transfer process.
          </Typography>
          <CheckCircleOutline color="success" />
        </Box>
      )}
      {isUtxoNotEnoughGas && (
        <ErrorMessage message="UTXO: Not enough funds for gas" />
      )}
      {isNevmNotEnoughGas && (
        <ErrorMessage message="NEVM: Not enough funds for gas" />
      )}
      <Button
        sx={{ display: "block" }}
        variant="contained"
        color="primary"
        disabled={!isReady || isSaving}
        type="submit"
      >
        Start Transfer
      </Button>
    </form>
  );
};

export default BridgeV3ConnectValidateStep;

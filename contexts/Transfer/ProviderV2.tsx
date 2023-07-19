import { useQuery } from "react-query";
import { TransferContext } from "./Provider";
import { ITransfer } from "./types";

type TransferProviderV2Props = {
  children: React.ReactNode;
  initialData: ITransfer;
};

export const TransferProviderV2: React.FC<TransferProviderV2Props> = ({
  children,
  initialData,
}) => {
  const { data: transfer } = useQuery(["transfer", initialData.id], {
    queryFn: () => {
      return Promise.resolve(initialData);
    },
    initialData,
  });
  return (
    <TransferContext.Provider value={{ transfer } as any}>
      {children}
    </TransferContext.Provider>
  );
};

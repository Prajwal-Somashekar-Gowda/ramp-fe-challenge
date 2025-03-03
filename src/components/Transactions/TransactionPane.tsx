import { useState } from "react";
import { InputCheckbox } from "../InputCheckbox";
import { TransactionPaneComponent } from "./types";

export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval: consumerSetTransactionApproval,
}) => {
  // Ensure transaction is always defined to avoid runtime errors
  const safeTransaction = transaction ?? {};

  const [approved, setApproved] = useState(safeTransaction.approved ?? false);

  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{safeTransaction.merchant || "Unknown Merchant"} </p>
        <b>{moneyFormatter.format(safeTransaction.amount ?? 0)}</b>
        <p className="RampText--hushed RampText--s">
          {safeTransaction.employee?.firstName || "Unknown"} {safeTransaction.employee?.lastName || "Employee"} - {safeTransaction.date || "Unknown Date"}
        </p>
      </div>
      <InputCheckbox
        id={safeTransaction.id}
        checked={approved}
        disabled={loading || !safeTransaction.id}
        onChange={async (newValue) => {
          if (!safeTransaction.id) return;
          try {
            await consumerSetTransactionApproval({
              transactionId: safeTransaction.id,
              newValue,
            });
            setApproved(newValue);
          } catch (error) {
            console.error("Failed to update transaction approval:", error);
          }
        }}
      />
    </div>
  );
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
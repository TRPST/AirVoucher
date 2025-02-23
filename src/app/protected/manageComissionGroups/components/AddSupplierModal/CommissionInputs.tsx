import React from "react";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileDataVoucher } from "@/app/types/common";

type CommissionField = "total_comm" | "retailer_comm" | "sales_agent_comm";

interface CommissionInputsProps {
  currentVoucher: MobileDataVoucher;
  errors: Record<string, string>;
  onCommissionChange: (field: CommissionField, value: number) => void;
}

const CommissionInputs = ({
  currentVoucher,
  errors,
  onCommissionChange,
}: CommissionInputsProps) => {
  // Helper function to format commission value for display
  const getCommissionDisplayValue = (value: number | undefined | null) => {
    if (value === undefined || value === null) return "";
    return Math.round(value * 100).toString();
  };

  const inputClasses = cn(
    "flex h-11 w-2/3 rounded-md bg-transparent py-3 text-sm outline-none",
    "border border-gray-300 px-4 dark:border-gray-600 dark:bg-gray-800",
    "placeholder:text-gray-500 dark:placeholder:text-gray-400",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
    "shadow-sm",
    "text-gray-900 dark:text-white",
  );

  return (
    <div className="mb-5 mt-10 flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex w-1/3 items-center space-x-2">
          <label className="font-semibold text-gray-700 dark:text-gray-300">
            Supplier Commission (%)
          </label>
          <TooltipProvider>
            <Tooltip content="Percentage of the voucher amount that will be paid as commission">
              <Info className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </Tooltip>
          </TooltipProvider>
        </div>
        <input
          type="number"
          min="0"
          max="100"
          value={getCommissionDisplayValue(currentVoucher?.total_comm)}
          onChange={(e) =>
            onCommissionChange("total_comm", parseFloat(e.target.value) || 0)
          }
          className={cn(
            inputClasses,
            errors.total_comm && "border-red-500 focus:ring-red-500",
          )}
          placeholder="E.g: enter 10 for 10%"
        />
      </div>
      {errors.total_comm && (
        <p className="text-sm text-red-500">{errors.total_comm}</p>
      )}

      <div className="flex items-center space-x-4">
        <label className="w-1/3 font-semibold text-gray-700 dark:text-gray-300">
          Retailer Commission (%)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={getCommissionDisplayValue(currentVoucher?.retailer_comm)}
          onChange={(e) =>
            onCommissionChange("retailer_comm", parseFloat(e.target.value) || 0)
          }
          className={inputClasses}
          placeholder="E.g: enter 10 for 10%"
        />
      </div>

      <div className="flex items-center space-x-4">
        <label className="w-1/3 font-semibold text-gray-700 dark:text-gray-300">
          Sales Agent Commission (%)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={getCommissionDisplayValue(currentVoucher?.sales_agent_comm)}
          onChange={(e) =>
            onCommissionChange(
              "sales_agent_comm",
              parseFloat(e.target.value) || 0,
            )
          }
          className={inputClasses}
          placeholder="E.g: enter 10 for 10%"
        />
      </div>
    </div>
  );
};

export default CommissionInputs;

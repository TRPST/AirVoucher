import React from "react";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileDataVoucher } from "@/app/types/common";

type CommissionField = "total_comm" | "retailer_comm" | "sales_agent_comm";

interface CommissionInputsProps {
  currentVoucher: MobileDataVoucher;
  errors: Record<string, string>;
  onCommissionChange: (field: string, value: number) => void;
}

const CommissionInputs: React.FC<CommissionInputsProps> = ({
  currentVoucher,
  errors,
  onCommissionChange,
}) => {
  // Convert decimal value to percentage for display with 2 decimal places max
  const getPercentageValue = (value: number | null) => {
    if (value === null || value === undefined) return "";
    // Format to 2 decimal places maximum
    const percentage = value * 100;
    return percentage.toString();
  };

  // Handle input change with decimal support
  const handleInputChange = (field: string, value: string) => {
    // Allow empty input
    if (!value) {
      onCommissionChange(field, 0);
      return;
    }

    // Parse the percentage value to a decimal (e.g., 10.5 to 0.105)
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      // Round to 2 decimal places for better precision
      const roundedValue = Math.round(numericValue * 100) / 100;
      onCommissionChange(field, roundedValue);
    }
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
          step="0.01"
          min="0"
          max="100"
          value={getPercentageValue(currentVoucher?.total_comm)}
          onChange={(e) => handleInputChange("total_comm", e.target.value)}
          onBlur={(e) => {
            // Format on blur to ensure consistent display
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
              e.target.value = value.toFixed(2);
            }
          }}
          className={cn(
            inputClasses,
            errors.total_comm && "border-red-500 focus:ring-red-500",
          )}
          placeholder="e.g., 10%"
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
          step="0.01"
          min="0"
          max="100"
          value={getPercentageValue(currentVoucher?.retailer_comm)}
          onChange={(e) => handleInputChange("retailer_comm", e.target.value)}
          onBlur={(e) => {
            // Format on blur to ensure consistent display
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
              e.target.value = value.toFixed(2);
            }
          }}
          className={inputClasses}
          placeholder="e.g., 5%"
        />
      </div>

      <div className="flex items-center space-x-4">
        <label className="w-1/3 font-semibold text-gray-700 dark:text-gray-300">
          Sales Agent Commission (%)
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={getPercentageValue(currentVoucher?.sales_agent_comm)}
          onChange={(e) =>
            handleInputChange("sales_agent_comm", e.target.value)
          }
          onBlur={(e) => {
            // Format on blur to ensure consistent display
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
              e.target.value = value.toFixed(2);
            }
          }}
          className={inputClasses}
          placeholder="e.g., 2%"
        />
      </div>
    </div>
  );
};

export default CommissionInputs;

import React from "react";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileDataVoucher } from "@/app/types/common";

interface CommissionInputsProps {
  currentVoucher: MobileDataVoucher;
  errors: Record<string, string>;
  onCommissionChange: (field: string, value: number) => void;
}

const CommissionInputs = ({
  currentVoucher,
  errors,
  onCommissionChange,
}: CommissionInputsProps) => {
  return (
    <div className="mb-5 mt-10 flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex w-1/3 items-center space-x-2">
          <label className="font-semibold text-gray-700 dark:text-gray-300">
            Total Commission (%)
          </label>
          <TooltipProvider>
            <Tooltip content="Percentage of the voucher amount that will be paid as commission">
              <Info className="h-4 w-4 text-gray-400" />
            </Tooltip>
          </TooltipProvider>
        </div>
        <input
          type="number"
          step="0.01"
          min="0"
          max="1"
          value={currentVoucher.total_comm ?? 0}
          onChange={(e) =>
            onCommissionChange("total_comm", parseFloat(e.target.value) || 0)
          }
          className={cn(
            "w-2/3 rounded-lg border px-4 py-2 dark:bg-gray-700 dark:text-white",
            errors.total_comm && "border-red-500",
          )}
          placeholder="0.00"
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
          max="1"
          value={currentVoucher.retailer_comm ?? 0}
          onChange={(e) =>
            onCommissionChange("retailer_comm", parseFloat(e.target.value) || 0)
          }
          className="w-2/3 rounded-lg border px-4 py-2 dark:bg-gray-700 dark:text-white"
          placeholder="0.00"
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
          max="1"
          value={currentVoucher.sales_agent_comm ?? 0}
          onChange={(e) =>
            onCommissionChange(
              "sales_agent_comm",
              parseFloat(e.target.value) || 0,
            )
          }
          className="w-2/3 rounded-lg border px-4 py-2 dark:bg-gray-700 dark:text-white"
          placeholder="0.00"
        />
      </div>
    </div>
  );
};

export default CommissionInputs;

import React from "react";
import { Upload } from "lucide-react";
import Papa from "papaparse";
import { MobileDataVoucher } from "@/app/types/common";

interface BulkUploadProps {
  onUpload: (vouchers: MobileDataVoucher[]) => void;
  className?: string;
}

interface ParseResult {
  data: Array<Record<string, string>>;
  errors: Papa.ParseError[];
  meta: Papa.ParseMeta;
}

const BulkUpload = ({ onUpload, className }: BulkUploadProps) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results: ParseResult) => {
        const vouchers = results.data.map((row) => ({
          name: row.name,
          vendorId: row.vendorId,
          amount: parseFloat(row.amount) * 100, // Convert to cents
          total_comm: parseFloat(row.total_comm),
          retailer_comm: parseFloat(row.retailer_comm),
          sales_agent_comm: parseFloat(row.sales_agent_comm),
          supplier_id: parseInt(row.supplier_id),
          supplier_name: row.supplier_name,
        }));
        onUpload(vouchers);
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  return (
    <div className={className}>
      <label
        htmlFor="csv-upload"
        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 p-4 text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:bg-gray-700"
      >
        <Upload className="h-5 w-5" />
        <span>Upload CSV</span>
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default BulkUpload;

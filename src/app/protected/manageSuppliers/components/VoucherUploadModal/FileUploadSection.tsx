import React from "react";
import { Upload } from "lucide-react";

interface FileUploadSectionProps {
  supplierName: string;
  handleFileSelect: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  supplierName,
  handleFileSelect,
  fileInputRef,
  handleFileChange,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Upload a .txt file containing voucher data for {supplierName}
        </p>
        <button
          onClick={handleFileSelect}
          className="flex items-center rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleFileSelect()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Select File
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".txt,.csv"
        />
      </div>
    </div>
  );
};

export default FileUploadSection;

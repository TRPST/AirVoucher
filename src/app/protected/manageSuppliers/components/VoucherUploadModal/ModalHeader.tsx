import React from "react";

interface ModalHeaderProps {
  supplierName: string;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ supplierName, onClose }) => {
  return (
    <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center justify-between p-4">
        <div>
          <h2
            id="voucher-upload-modal-title"
            className="text-xl font-semibold text-gray-900 dark:text-white"
          >
            Upload Vouchers for {supplierName}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500 dark:hover:bg-gray-700"
          aria-label="Close modal"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onClose()}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ModalHeader;

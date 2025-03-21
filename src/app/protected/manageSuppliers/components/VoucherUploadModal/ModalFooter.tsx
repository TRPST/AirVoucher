import React from "react";

interface ModalFooterProps {
  onClose: () => void;
  handleSaveVouchers: () => void;
  isDisabled: boolean;
}

const ModalFooter: React.FC<ModalFooterProps> = ({
  onClose,
  handleSaveVouchers,
  isDisabled,
}) => {
  return (
    <div className="border-t border-gray-200 p-4 dark:border-gray-700">
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onClose()}
        >
          Cancel
        </button>
        <button
          onClick={handleSaveVouchers}
          disabled={isDisabled}
          className={`rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            !isDisabled
              ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              : "cursor-not-allowed bg-blue-400"
          }`}
          tabIndex={0}
          onKeyDown={(e) =>
            !isDisabled && e.key === "Enter" && handleSaveVouchers()
          }
        >
          Save Vouchers
        </button>
      </div>
    </div>
  );
};

export default ModalFooter;

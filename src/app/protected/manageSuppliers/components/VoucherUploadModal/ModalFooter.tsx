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
    <div className="border-t border-gray-200 p-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveVouchers}
          disabled={isDisabled}
          className={`rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isDisabled
              ? "cursor-not-allowed bg-blue-400 dark:bg-blue-600 dark:opacity-50"
              : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          }`}
        >
          Save Vouchers
        </button>
      </div>
    </div>
  );
};

export default ModalFooter;

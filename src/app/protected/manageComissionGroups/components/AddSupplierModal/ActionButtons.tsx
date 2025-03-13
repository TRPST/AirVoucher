import React from "react";

interface ActionButtonsProps {
  loading: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  loading,
  onCancel,
  onSubmit,
}) => {
  return (
    <div className="mt-6 flex justify-end space-x-3">
      <button
        className="w-32 rounded-lg bg-gray-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-gray-700 dark:text-white"
        onClick={onCancel}
        disabled={loading}
      >
        Cancel
      </button>
      <button
        className={`w-32 rounded-lg bg-blue-700 py-3 font-semibold text-white shadow transition duration-300 ${
          loading ? null : "hover:bg-blue-800"
        } dark:text-white`}
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2 bg-blue-700">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            <span className="dark:text-white">Saving...</span>
          </div>
        ) : (
          "Save"
        )}
      </button>
    </div>
  );
};

export default ActionButtons;

import React from "react";

interface TableCellProps {
  children: React.ReactNode;
}

const TableCell: React.FC<TableCellProps> = ({ children }) => {
  return (
    <td className="whitespace-nowrap border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
      {children}
    </td>
  );
};

export default TableCell;

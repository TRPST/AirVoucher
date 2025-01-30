import React from "react";

interface CommissionTableProps {
  data: Array<{
    name: string;
    suppliers: Array<{
      name: string;
      vouchers: Array<{
        name: string;
        total_commission: number;
        retailer_commission: number;
        agent_commission: number;
      }>;
    }>;
  }>;
  setAddSupplierModalOpen: (open: boolean) => void;
}

const CommissionTable: React.FC<CommissionTableProps> = ({
  data,
  setAddSupplierModalOpen,
}) => {
  return (
    <div className="container mx-auto py-8">
      {data.map((group) => (
        <div key={group.name} className="mb-8">
          {/* Commission Group Name */}
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-2xl font-bold">{group.name}</h2>
            <button
              className="rounded border border-blue-700 px-3 py-2 font-semibold text-blue-500 shadow transition duration-300 hover:bg-blue-800 hover:text-white dark:border-blue-600 dark:hover:bg-blue-700"
              onClick={() => setAddSupplierModalOpen(true)}
            >
              Add Supplier
            </button>
          </div>

          {/* Table for Suppliers and Vouchers */}
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Supplier</th>
                <th className="border border-gray-300 px-4 py-2">Voucher</th>
                <th className="border border-gray-300 px-4 py-2">Total Comm</th>
                <th className="border border-gray-300 px-4 py-2">
                  Retailer Comm
                </th>
                <th className="border border-gray-300 px-4 py-2">Agent Comm</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {group.suppliers.map((supplier) => (
                <>
                  {supplier.vouchers.map((voucher, index) => (
                    <tr key={voucher.name}>
                      {/* Supplier Name - Only on the first row */}
                      {index === 0 && (
                        <td
                          className="border border-gray-300 px-4 py-2"
                          rowSpan={supplier.vouchers.length}
                        >
                          {supplier.name}
                        </td>
                      )}
                      <td className="border border-gray-300 px-4 py-2">
                        {voucher.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {voucher.total_commission}%
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {voucher.retailer_commission}%
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {voucher.agent_commission}%
                      </td>
                      {index === 0 && (
                        <td
                          className="border border-gray-300 px-4 py-2"
                          rowSpan={supplier.vouchers.length}
                        >
                          <button className="text-blue-500 underline">
                            Edit
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default CommissionTable;

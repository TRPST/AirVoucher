import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@nextui-org/react";
import { Supplier, Voucher } from "../../../../types/supplier";
import axios from "axios";

interface VoucherInventoryProps {
  supplier: Supplier;
  vouchers: Voucher[];
  onRefresh: () => void;
}

const VoucherInventory: React.FC<VoucherInventoryProps> = ({
  supplier,
  vouchers,
  onRefresh,
}) => {
  const [newVoucherCode, setNewVoucherCode] = useState("");
  const [newVoucherValue, setNewVoucherValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Count vouchers by status
  const availableVouchers = vouchers.filter(
    (v) => v.status === "available",
  ).length;
  const soldVouchers = vouchers.filter((v) => v.status === "sold").length;
  const expiredVouchers = vouchers.filter((v) => v.status === "expired").length;

  // Handle adding a new voucher
  const handleAddVoucher = async () => {
    if (!newVoucherCode || !newVoucherValue) {
      setError("Please enter both code and value");
      return;
    }

    const value = parseFloat(newVoucherValue);
    if (isNaN(value) || value <= 0) {
      setError("Please enter a valid value");
      return;
    }

    setIsAdding(true);
    setError(null);

    try {
      await axios.post("/api/vouchers/add", {
        supplierId: supplier.id,
        code: newVoucherCode,
        value,
      });

      setNewVoucherCode("");
      setNewVoucherValue("");
      onRefresh();
    } catch (error) {
      setError("Failed to add voucher. It might be a duplicate code.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between">
        <h3 className="text-lg font-medium">
          Voucher Inventory for {supplier.name}
        </h3>
        <div className="flex gap-2">
          <Chip color="success" variant="flat">
            Available: {availableVouchers}
          </Chip>
          <Chip color="primary" variant="flat">
            Sold: {soldVouchers}
          </Chip>
          <Chip color="warning" variant="flat">
            Expired: {expiredVouchers}
          </Chip>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-2">
            <Input
              label="Voucher Code"
              placeholder="Enter voucher code"
              value={newVoucherCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewVoucherCode(e.target.value)
              }
              className="flex-grow"
            />
            <Input
              label="Value"
              placeholder="Enter value"
              type="number"
              value={newVoucherValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewVoucherValue(e.target.value)
              }
              className="w-32"
            />
            <Button
              color="primary"
              onClick={handleAddVoucher}
              isLoading={isAdding}
            >
              Add Voucher
            </Button>
          </div>

          {error && <div className="text-danger text-sm">{error}</div>}

          <div className="max-h-96 overflow-y-auto">
            <Table aria-label="Voucher inventory table">
              <TableHeader>
                <TableColumn>CODE</TableColumn>
                <TableColumn>VALUE</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>CREATED AT</TableColumn>
                <TableColumn>SOLD AT</TableColumn>
              </TableHeader>
              <TableBody>
                {vouchers.map((voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell>{voucher.code}</TableCell>
                    <TableCell>{voucher.value}</TableCell>
                    <TableCell>
                      <Chip
                        color={
                          voucher.status === "available"
                            ? "success"
                            : voucher.status === "sold"
                              ? "primary"
                              : "warning"
                        }
                        variant="flat"
                      >
                        {voucher.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      {new Date(voucher.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {voucher.soldAt
                        ? new Date(voucher.soldAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default VoucherInventory;

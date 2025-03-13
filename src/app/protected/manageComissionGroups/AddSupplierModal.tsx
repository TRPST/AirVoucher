import React from "react";
import AddSupplierModalComponent from "./components/AddSupplierModal";
import { MobileDataVoucher } from "@/app/types/common";

const AddSupplierModal = ({
  isOpen,
  onClose,
  onAddVouchers,
  commGroupId,
  commGroupName,
  existingVouchers,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddVouchers: (vouchers: MobileDataVoucher[]) => void;
  commGroupId: string;
  commGroupName: string;
  existingVouchers?: MobileDataVoucher[];
}) => {
  return (
    <AddSupplierModalComponent
      isOpen={isOpen}
      onClose={onClose}
      onAddVouchers={onAddVouchers}
      commGroupId={commGroupId}
      commGroupName={commGroupName}
      existingVouchers={existingVouchers}
    />
  );
};

export default AddSupplierModal;

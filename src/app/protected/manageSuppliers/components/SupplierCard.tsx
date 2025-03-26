import { deleteVoucherAction } from "../actions";

const [refreshVouchers, setRefreshVouchers] = useState(false);

const handleDeleteVoucher = async (voucherId: string) => {
  return await deleteVoucherAction(voucherId);
};

const handleVoucherDeleted = () => {
  setRefreshVouchers(true);
  // Refresh the vouchers list
  fetchVouchers();
};

<VoucherListModal
  isOpen={isVoucherListModalOpen}
  onClose={() => setVoucherListModalOpen(false)}
  supplierName={supplier.supplier_name}
  vouchers={vouchers}
  error={voucherError}
  deleteVoucher={handleDeleteVoucher}
  onVoucherDeleted={handleVoucherDeleted}
/>;

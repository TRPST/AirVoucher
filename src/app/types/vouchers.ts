export interface VoucherGroup {
  id: number;
  name: string;
  created_at: Date;
  supplier_id: number;
}

export interface MainVoucherGroup {
  id: number;
  name: string;
  created_at: Date;
  supplier_id: number;
  voucher_groups?: VoucherGroup[];
}

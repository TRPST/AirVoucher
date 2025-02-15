import { z } from "zod";

export interface MobileDataVoucher {
  id?: string | number;
  name: string;
  vendorId: string;
  amount: number;
  total_comm: number;
  retailer_comm: number;
  sales_agent_comm: number;
  supplier_id: number;
  supplier_name: string;
}

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

export const NetworkProvider = {
  CELLC: "CELLC",
  MTN: "MTN",
  TELKOM: "TELKOM",
  VODACOM: "VODACOM",
} as const;

export type NetworkProviderType = keyof typeof NetworkProvider;

export interface VoucherWithNetwork extends MobileDataVoucher {
  networkProvider: NetworkProviderType;
}

export const voucherFormSchema = z.object({
  name: z.string().min(1, "Voucher name is required"),
  vendorId: z.string().min(1, "Vendor ID is required"),
  amount: z.number().min(0, "Amount must be positive"),
  networkProvider: z.enum(
    Object.keys(NetworkProvider) as [
      NetworkProviderType,
      ...NetworkProviderType[],
    ],
  ),
  total_comm: z.number().min(0).max(1, "Commission must be between 0 and 1"),
  retailer_comm: z.number().min(0).max(1, "Commission must be between 0 and 1"),
  sales_agent_comm: z
    .number()
    .min(0)
    .max(1, "Commission must be between 0 and 1"),
  supplier_id: z.number().min(1, "Supplier is required"),
  supplier_name: z.string().min(1, "Supplier name is required"),
});

export type VoucherFormData = z.infer<typeof voucherFormSchema>;

export interface VoucherFilter {
  priceRange: { min: number; max: number };
  vendor: string[];
  commissionRange: { min: number; max: number };
}

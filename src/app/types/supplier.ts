export interface Supplier {
  id: string;
  supplier_name: string;
  status: boolean;
  voucherCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Voucher {
  id: string;
  supplierId: string;
  code: string;
  value: number;
  status: "available" | "sold" | "expired";
  createdAt: string;
  soldAt?: string;
}

export interface SalesReportData {
  initialCount: number;
  remainingCount: number;
  soldCount: number;
  totalValue: number;
  period: string;
}

export type ReportPeriod = "daily" | "weekly" | "monthly";
export type ReportFormat = "csv" | "pdf";

export interface VoucherUploadResponse {
  success: boolean;
  count: number;
  errors?: string[];
}

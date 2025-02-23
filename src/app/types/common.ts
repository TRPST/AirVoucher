type Role = "superAdmin" | "admin" | "retailer" | "cashier";

export type User = {
  id: string;
  name: string;
  email: string;
  contact_number: string;
  password: string;
  active: boolean;
  role: Role;
  terminal_access: boolean;
  assigned_retailers?: any[];
};

export interface Retailer {
  id: string;
  name: string;
  email: string;
  password: string;
  contact_number: string;
  contact_person: string;
  location: string;
  active: boolean;
  terminal_access: boolean;
  assigned_terminals?: string[];
  assigned_admin: string;
  admin_name?: string;
  created_at?: Date;
  comm_group_id?: string | number;
}

export type Terminal = {
  id: string;
  assigned_retailer: string;
  assigned_cashier: string;
  cashier_name: string;
  retailer_name: string;
  active: boolean;
  created_at: Date;
};

export interface CommGroup {
  id?: string;
  name: string;
  email: string;
  contact_number: string;
  active: boolean;
  terminal_access: boolean;
  role: string;
  assigned_retailers: Retailer[];
  vouchers?: MobileDataVoucher[];
}

export type Supplier = {
  id: number;
  supplier_name: string;
  created_at: Date;
};

export type VoucherGroup = {
  id: number;
  voucher_group_name: string;
  total_comm: number;
  retailer_comm: number;
  sales_agent_comm: number;
  created_at: Date;
};

export type MainVoucherGroup = {
  id: number;
  name: string;
  supplier_id: number;
  total_comm: number;
  retailer_comm: number;
  sales_agent_comm: number;
  created_at: Date;
};

export interface MobileDataVoucher {
  id?: string | number;
  name: string;
  supplier_id: number;
  supplier_name: string;
  vendorId: string;
  amount: number;
  total_comm: number;
  retailer_comm: number;
  sales_agent_comm: number;
  category?: string;
  profit?: number;
}

export interface SupplierAPI {
  id: number;
  name: string;
  supplier_name?: string;
  created_at?: Date;
}

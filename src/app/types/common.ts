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

export type Retailer = {
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
  created_at?: Date;
};

export type Terminal = {
  id: string;
  assigned_retailer: string;
  assigned_cashier: string;
  cashier_name: string;
  retailer_name: string;
  active: boolean;
  created_at: Date;
};

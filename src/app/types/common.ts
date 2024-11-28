type Role = "superAdmin" | "admin" | "retailer" | "terminal";

export type Admin = {
  id: string;
  name: string;
  email: string;
  contact_number: string;
  password: string;
  active: boolean;
  role: Role;
  terminal_access: boolean;
  assigned_retailers?: string[];
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
};

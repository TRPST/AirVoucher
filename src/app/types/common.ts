type Role = "superAdmin" | "admin" | "retailer" | "terminal";

export type Admin = {
  id: string;
  name: string;
  email: string;
  password: string;
  active: boolean;
  role: Role;
  terminalAccess: boolean;
  assignedRetailers?: string[];
};

export type Retailer = {
  id: string;
  name: string;
  email: string;
  contactNo: string;
  contactPerson: string;
  location: string;
  active: boolean;
  createdAt: string;
};

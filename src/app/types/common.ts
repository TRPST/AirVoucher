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

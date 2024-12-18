"use server";

import { createClient } from "../../../../utils/supabase/server";
import { headers } from "next/headers";
import { Terminal } from "../../types/common";

export const signUpTerminalAction = async (
  newTerminal: any,
  terminalsLength: number,
) => {
  const supabase = await createClient();

  const newTerminalId = `TER${terminalsLength + 1}`;

  //create the new cashier user
  const { data, error } = await supabase.auth.admin.createUser({
    email: newTerminal.cashier_email,
    password: newTerminal.password,
    email_confirm: true,
    user_metadata: {
      role: "cashier",
    },
  });

  if (error) {
    return { error: error.message };
  }

  const userId = data.user?.id;
  if (!userId) {
    return { error: "User ID not found" };
  }

  // Fetch the existing assigned_terminals list
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("assigned_terminals")
    .eq("id", userId)
    .maybeSingle(); // Use maybeSingle() to handle multiple or no rows

  if (userError) {
    console.error("Error fetching user:", userError);
    return { error: userError.message };
  }

  // Append the new terminal ID to the existing list
  const updatedAssignedTerminals = [
    ...(user?.assigned_terminals || []),
    { id: newTerminalId },
  ];

  // Update the user with the new assigned_terminals list
  const { error: terminalUserError } = await supabase.from("users").upsert({
    id: userId,
    name: newTerminal.cashier_name,
    email: newTerminal.cashier_email,
    contact_number: newTerminal.contact_number,
    role: "cashier",
    active: newTerminal.active,
    assigned_terminals: updatedAssignedTerminals,
  });

  if (terminalUserError) {
    return { error: terminalUserError.message };
  }

  // Upsert the terminal information
  const { error: terminalError } = await supabase.from("terminals").upsert({
    id: newTerminalId,
    assigned_cashier: userId,
    cashier_name: newTerminal.cashier_name,
    retailer_name: newTerminal.retailer_name,
    active: newTerminal.active,
    contact_number: newTerminal.contact_number,
    assigned_retailer: newTerminal.assigned_retailer,
  });

  if (terminalError) {
    return { error: terminalError.message };
  }

  return { success: "Terminal and user created successfully" };
};

export const getTerminalsAction = async () => {
  const supabase = await createClient();

  const { data: terminals, error } = await supabase
    .from("terminals")
    .select("*")
    .order("created_at", { ascending: false }); // Order by created_at in descending order

  if (error) {
    console.error("Error fetching retailers:", error);
    return;
  }

  return { terminals };
};

export const getTerminalsByAdminIdAction = async (adminId: string) => {
  console.log("Admin ID passed to function: ", adminId);

  const supabase = await createClient();

  const { data: retailers, error } = await supabase
    .from("retailers")
    .select("*")
    .eq("assigned_admin", `"${adminId}"`);

  console.log("Terminals fetched: ", retailers);

  if (error) {
    console.error("Error fetching retailers:", error);
    return { error: error.message };
  }

  if (!retailers || retailers.length === 0) {
    console.log("No retailers found for admin ID: ", adminId);
    return { retailers: [] };
  }

  //console.log("Terminals fetched: ", retailers);

  return { retailers };
};

export const getRetailersByUserIdAction = async (userId: string) => {
  console.log("User ID passed to function: ", userId);

  const supabase = await createClient();

  const { data: retailers, error } = await supabase
    .from("retailers")
    .select("*")
    .eq("assigned_owner", `${userId}`);

  //console.log("Retailers fetched: ", retailers);

  if (error) {
    console.error("Error fetching retailers:", error);
    return { error: error.message };
  }

  if (!retailers || retailers.length === 0) {
    console.log("No retailers found for user ID: ", userId);
    return { retailers: [] };
  }

  //console.log("Retailers fetched: ", retailers);

  return { retailers };
};

//function to edit retailer based on updatedTerminal state
// export const editTerminalAction = async (updatedTerminal: Terminal) => {
//   const supabase = await createClient();

//   const { error } = await supabase.from("terminals").upsert({
//     id: updatedTerminal.id,
//     name: updatedTerminal.name,
//     email: updatedTerminal.email,
//     contact_number: updatedTerminal.contact_number,
//     contact_person: updatedTerminal.contact_person,
//     location: updatedTerminal.location,
//     active: updatedTerminal.active,
//     terminal_access: updatedTerminal.terminal_access,
//   });

//   if (error) {
//     return { error: error.message };
//   }

//   return { success: "Terminal updated successfully" };
// };

//function to delete retailer based on retailerId
export const deleteTerminalAction = async (retailerId: string) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("retailers")
    .delete()
    .eq("id", retailerId);

  if (error) {
    return { error: error.message };
  }

  return { success: "Terminal deleted successfully" };
};

//function to getRetailerByIdAction
export const getRetailerByIdAction = async (retailerId: string) => {
  const supabase = await createClient();

  const { data: retailer, error } = await supabase
    .from("retailers")
    .select("*")
    .eq("id", retailerId)
    .single();

  if (error) {
    console.error("Error fetching retailer:", error);
    return { error: error.message };
  }

  return { retailer };
};

//function to getCashierByIdAction
export const getCashierByIdAction = async (cashierId: string) => {
  const supabase = await createClient();

  const { data: cashier, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", cashierId)
    .single();

  if (error) {
    console.error("Error fetching cashier:", error);
    return { error: error.message };
  }

  return { cashier };
};

"use server";

import { createClient } from "../../../../utils/supabase/server";
import { headers } from "next/headers";
import { Terminal } from "../../types/common";

export const signUpTerminalAction = async (retailer: Terminal) => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!retailer.email || !retailer.contact_number) {
    return { error: "Terminal email and contact are required" };
  }

  const { data, error } = await supabase.auth.signUp({
    email: retailer.email,
    password: retailer.password,
  });

  if (error) {
    return { error: error.message };
  }

  const userId = data.user?.id;
  if (!userId) {
    return { error: "User ID not found" };
  }

  // Fetch the existing assigned_retailers list
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("assigned_retailers")
    .eq("id", userId)
    .maybeSingle(); // Use maybeSingle() to handle multiple or no rows

  if (userError) {
    console.error("Error fetching user:", userError);
    return { error: userError.message };
  }

  // Append the new retailer ID to the existing list
  const updatedAssignedTerminals = [
    ...(user?.assigned_retailers || []),
    { id: retailer.id },
  ];

  // Update the user with the new assigned_retailers list
  const { error: retailerUserError } = await supabase.from("users").upsert({
    id: userId,
    name: retailer.contact_person,
    email: retailer.email,
    role: "retailer",
    active: retailer.active,
    assigned_retailers: updatedAssignedTerminals,
  });

  if (retailerUserError) {
    return { error: retailerUserError.message };
  }

  // Upsert the retailer information
  const { error: retailerError } = await supabase.from("retailers").upsert({
    id: retailer.id,
    name: retailer.name,
    email: retailer.email,
    contact_number: retailer.contact_number,
    contact_person: retailer.contact_person,
    location: retailer.location,
    active: retailer.active,
    terminal_access: retailer.terminal_access,
    assigned_admin: retailer.assigned_admin,
  });

  if (retailerError) {
    return { error: retailerError.message };
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

//function to edit retailer based on updatedTerminal state
export const editTerminalAction = async (updatedTerminal: Terminal) => {
  const supabase = await createClient();

  const { error } = await supabase.from("terminals").upsert({
    id: updatedTerminal.id,
    name: updatedTerminal.name,
    email: updatedTerminal.email,
    contact_number: updatedTerminal.contact_number,
    contact_person: updatedTerminal.contact_person,
    location: updatedTerminal.location,
    active: updatedTerminal.active,
    terminal_access: updatedTerminal.terminal_access,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Terminal updated successfully" };
};

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

"use server";

import { createClient } from "../../../../utils/supabase/server";
import { headers } from "next/headers";
import { Retailer } from "../../types/common";

export const signUpRetailerAction = async (retailer: Retailer) => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!retailer.email || !retailer.contact_number) {
    return { error: "Retailer email and contact are required" };
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

  const { error: retailerUserError } = await supabase.from("users").upsert({
    id: userId,
    name: retailer.contact_person,
    email: retailer.email,
    role: "retailer",
    active: retailer.active,
  });

  if (retailerUserError) {
    return { error: retailerUserError.message };
  }

  const { error: retailerError } = await supabase.from("retailers").upsert({
    id: retailer.id,
    name: retailer.name,
    email: retailer.email,
    contact_number: retailer.contact_number,
    contact_person: retailer.contact_person,
    location: retailer.location,
    active: retailer.active,
  });

  if (retailerError) {
    return { error: retailerError.message };
  }

  return { success: "Retailer and user created successfully" };
};

export const getRetailersAction = async () => {
  const supabase = await createClient();

  const { data: assignedRetailers, error: assignedError } = await supabase
    .from("users")
    .select("assigned_retailers");

  if (assignedError) {
    console.error("Error fetching assigned retailers:", assignedError);
    return;
  }

  const assignedRetailerIds = assignedRetailers
    .flatMap((user) => user.assigned_retailers)
    .map((retailer) => retailer?.id);

  const { data: retailers, error } = await supabase
    .from("retailers")
    .select("*")
    .not("id", "in", `(${assignedRetailerIds.join(",")})`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching retailers:", error);
  } else {
    console.log("Available retailers:", retailers);
  }

  return { retailers };
};

//function to edit retailer based on updatedRetailer state
export const editRetailerAction = async (updatedRetailer: Retailer) => {
  const supabase = await createClient();

  const { error } = await supabase.from("retailers").upsert({
    id: updatedRetailer.id,
    name: updatedRetailer.name,
    email: updatedRetailer.email,
    contact_number: updatedRetailer.contact_number,
    contact_person: updatedRetailer.contact_person,
    location: updatedRetailer.location,
    active: updatedRetailer.active,
    terminal_access: updatedRetailer.terminal_access,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Retailer updated successfully" };
};

//function to delete retailer based on retailerId
export const deleteRetailerAction = async (retailerId: string) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("retailers")
    .delete()
    .eq("id", retailerId);

  if (error) {
    return { error: error.message };
  }

  return { success: "Retailer deleted successfully" };
};

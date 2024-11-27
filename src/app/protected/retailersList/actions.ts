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

  const { data: retailers, error } = await supabase
    .from("retailers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { retailers };
};

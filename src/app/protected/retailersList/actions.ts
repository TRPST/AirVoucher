"use server";

import { encodedRedirect } from "../../../../utils/utils";
import { createClient } from "../../../../utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Retailer } from "../../types/common";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    if (error) {
      return { error: error.message };
    }
  } else {
    return { success: "User created successfully" };
  }
};

export const signUpRetailerAction = async (retailer: Retailer) => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!retailer.email || !retailer.contactNo) {
    return { error: "Retailer email and contact are required" };
  }

  const { data, error } = await supabase.auth.signUp({
    email: admin.email,
    password: admin.password,
  });

  if (error) {
    return { error: error.message };
  }

  const userId = data.user?.id;
  if (!userId) {
    return { error: "User ID not found" };
  }
  const { error: upsertError } = await supabase.from("users").upsert({
    id: userId,
    name: admin.name,
    email: admin.email,
    role: admin.role, // or any other role you want to assign
    active: admin.active,
    terminal_access: admin.terminal_access,
    assigned_retailers: admin.assigned_retailers,
  });

  if (upsertError) {
    return { error: upsertError.message };
  }

  return { success: "User created successfully" };
};

export const getAdminsAction = async () => {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .in("role", ["admin", "superAdmin"]);

  if (error) {
    return { error: error.message };
  }

  return { users };
};

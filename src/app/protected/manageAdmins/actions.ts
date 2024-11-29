"use server";

import { encodedRedirect } from "../../../../utils/utils";
import { createClient } from "../../../../utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Admin } from "../../types/common";

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

export const signUpAdminAction = async (admin: Admin) => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!admin.email || !admin.password) {
    return { error: "Email and password are required" };
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
    contact_number: admin.contact_number,
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

//function to edit retailer based on updatedRetailer state
export const editAdminAction = async (updatedAdmin: Admin) => {
  const supabase = await createClient();

  const { error } = await supabase.from("users").upsert({
    id: updatedAdmin.id,
    name: updatedAdmin.name,
    email: updatedAdmin.email,
    contact_number: updatedAdmin.contact_number,
    active: updatedAdmin.active,
    role: updatedAdmin.role,
    terminal_access: updatedAdmin.terminal_access,
    assigned_retailers: updatedAdmin.assigned_retailers,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Admin updated successfully" };
};

//function to delete retailer based on retailerId
export const deleteAdminAction = async (adminId: string) => {
  const supabase = await createClient();

  const { error } = await supabase.from("users").delete().eq("id", adminId);

  if (error) {
    return { error: error.message };
  }

  return { success: "Admin deleted successfully" };
};

export const checkUserSignedIn = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }
};

"use server";

import { encodedRedirect } from "../../../../utils/utils";
import { createClient } from "../../../../utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "../../types/common";

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

export const signUpAdminAction = async (admin: User) => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!admin.email || !admin.password) {
    return { error: "Email and password are required" };
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: admin.email,
    password: admin.password,
    email_confirm: true,
    user_metadata: {
      role: admin.role,
    },
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

  return { success: "Admin created successfully" };
};

export const getAdminsAction = async () => {
  const supabase = await createClient();

  // Fetch all admins and superAdmins
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("*")
    .in("role", ["admin", "superAdmin"]);

  if (usersError) {
    return { error: usersError.message };
  }

  // Fetch all retailers
  const { data: retailers, error: retailersError } = await supabase
    .from("retailers")
    .select("*");

  if (retailersError) {
    return { error: retailersError.message };
  }

  // Map assigned_retailers IDs to retailer objects
  const usersWithRetailers = users.map((user) => ({
    ...user,
    assigned_retailers: retailers.filter(
      (retailer) => retailer.assigned_admin === `${user.id}`,
    ),
  }));

  return { users: usersWithRetailers };
};

export const assignAdminToRetailer = async (
  retailerId: string,
  adminId: string,
) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("retailers")
    .update({ assigned_admin: `${adminId}` })
    .eq("id", retailerId);

  if (error) {
    console.error("Error assigning admin to retailer:", error);
    return { error: error.message };
  }

  return { success: true };
};

export const removeAdminFromRetailer = async (retailerId: string) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("retailers")
    .update({ assigned_admin: null })
    .eq("id", retailerId);

  if (error) {
    console.error("Error removing admin from retailer:", error);
    return { error: error.message };
  }

  return { success: true };
};
//function to edit retailer based on updatedRetailer state
export const editAdminAction = async (updatedAdmin: User) => {
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

  // Fetch the retailers assigned to the admin
  const { data: retailers, error: fetchError } = await supabase
    .from("retailers")
    .select("id")
    .eq("assigned_admin", `${adminId}`);

  if (fetchError) {
    console.error("Error fetching retailers:", fetchError);
    return { error: fetchError.message };
  }

  // Update the assigned_admin column of the affected retailers to null
  if (retailers && retailers.length > 0) {
    const retailerIds = retailers.map((retailer) => retailer.id);

    const { error: updateError } = await supabase
      .from("retailers")
      .update({ assigned_admin: null })
      .in("id", retailerIds);

    if (updateError) {
      console.error("Error updating retailers:", updateError);
      return { error: updateError.message };
    }
  }

  // Delete the admin
  const { error: deleteError } = await supabase
    .from("users")
    .delete()
    .eq("id", adminId);

  if (deleteError) {
    console.error("Error deleting admin:", deleteError);
    return { error: deleteError.message };
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

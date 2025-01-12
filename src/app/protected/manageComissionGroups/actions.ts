"use server";

import { encodedRedirect } from "../../../../utils/utils";
import { createClient } from "../../../../utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CommGroup } from "../../types/common";

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
    return { success: "CommGroup created successfully" };
  }
};

export const signUpCommGroupAction = async (commGroup: CommGroup) => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!commGroup.name) {
    return { error: "Commission group name is required" };
  }

  const { data, error } = await supabase.auth.admin.createCommGroup({
    email: commGroup.email,
    password: commGroup.password,
    email_confirm: true,
    user_metadata: {
      role: commGroup.role,
    },
  });

  if (error) {
    return { error: error.message };
  }

  const userId = data.user?.id;
  if (!userId) {
    return { error: "CommGroup ID not found" };
  }
  const { error: upsertError } = await supabase.from("users").upsert({
    id: userId,
    name: commGroup.name,
    email: commGroup.email,
    contact_number: commGroup.contact_number,
    role: commGroup.role, // or any other role you want to assign
    active: commGroup.active,
    terminal_access: commGroup.terminal_access,
    assigned_retailers: commGroup.assigned_retailers,
  });

  if (upsertError) {
    return { error: upsertError.message };
  }

  return { success: "CommGroup created successfully" };
};

export const getCommGroupsAction = async () => {
  const supabase = await createClient();

  // Fetch all commGroups and superCommGroups
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("*")
    .in("role", ["commGroup", "superCommGroup"]);

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
      (retailer) => retailer.assigned_commGroup === `${user.id}`,
    ),
  }));

  return { users: usersWithRetailers };
};

export const assignCommGroupToRetailer = async (
  retailerId: string,
  commGroupId: string,
) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("retailers")
    .update({ assigned_commGroup: `${commGroupId}` })
    .eq("id", retailerId);

  if (error) {
    console.error("Error assigning commGroup to retailer:", error);
    return { error: error.message };
  }

  return { success: true };
};

export const removeCommGroupFromRetailer = async (retailerId: string) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("retailers")
    .update({ assigned_commGroup: null })
    .eq("id", retailerId);

  if (error) {
    console.error("Error removing commGroup from retailer:", error);
    return { error: error.message };
  }

  return { success: true };
};
//function to edit retailer based on updatedRetailer state
export const editCommGroupAction = async (updatedCommGroup: CommGroup) => {
  const supabase = await createClient();

  const { error } = await supabase.from("users").upsert({
    id: updatedCommGroup.id,
    name: updatedCommGroup.name,
    email: updatedCommGroup.email,
    contact_number: updatedCommGroup.contact_number,
    active: updatedCommGroup.active,
    role: updatedCommGroup.role,
    terminal_access: updatedCommGroup.terminal_access,
    assigned_retailers: updatedCommGroup.assigned_retailers,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "CommGroup updated successfully" };
};

//function to delete retailer based on retailerId
export const deleteCommGroupAction = async (commGroupId: string) => {
  const supabase = await createClient();

  // Fetch the retailers assigned to the commGroup
  const { data: retailers, error: fetchError } = await supabase
    .from("retailers")
    .select("id")
    .eq("assigned_commGroup", `${commGroupId}`);

  if (fetchError) {
    console.error("Error fetching retailers:", fetchError);
    return { error: fetchError.message };
  }

  // Update the assigned_commGroup column of the affected retailers to null
  if (retailers && retailers.length > 0) {
    const retailerIds = retailers.map((retailer) => retailer.id);

    const { error: updateError } = await supabase
      .from("retailers")
      .update({ assigned_commGroup: null })
      .in("id", retailerIds);

    if (updateError) {
      console.error("Error updating retailers:", updateError);
      return { error: updateError.message };
    }
  }

  // Delete the commGroup
  const { error: deleteError } = await supabase
    .from("users")
    .delete()
    .eq("id", commGroupId);

  if (deleteError) {
    console.error("Error deleting commGroup:", deleteError);
    return { error: deleteError.message };
  }

  return { success: "CommGroup deleted successfully" };
};

export const checkCommGroupSignedIn = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getCommGroup();

  if (!user) {
    return redirect("/");
  }
};

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

export const createCommGroup = async (commGroup: CommGroup) => {
  const supabase = await createClient();

  if (!commGroup.name) {
    return { error: "Commission group name is required" };
  }

  const { data, error } = await supabase
    .from("commission_groups")
    .insert([{ name: commGroup.name }]);

  if (error) {
    return { error: error.message };
  }

  return { success: "Commission group created successfully" };
};

export const getSuppliersAction = async () => {
  const supabase = await createClient();

  console.log("Fetching suppliers from database...");

  const { data: suppliers, error } = await supabase
    .from("suppliers")
    .select("*");

  if (error) {
    console.error("Error fetching suppliers:", error);
    return { error: error.message };
  }

  console.log("Suppliers fetched:", suppliers);

  if (!suppliers || suppliers.length === 0) {
    console.log("No suppliers found.");
    return { suppliers: [] };
  }

  return { suppliers };
};

export const getSupplierVouchers = async (supplierId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vouchers")
    .select("*")
    .eq("supplier_id", supplierId);

  if (error) {
    return { error: error.message };
  }

  return { vouchers: data };
};

// Fetch Commission Groups with Suppliers and Vouchers
export const getCommGroupsWithSuppliersAndVouchers = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("commission_groups")
    .select(
      "id, name, commission_group_suppliers(supplier_id, suppliers(name, vouchers(id, name, total_commission, retailer_commission, agent_commission)))",
    );

  if (error) {
    console.error("Error fetching commission groups:", error);
    return [];
  }

  console.log("DATA", data);

  return data.map((group) => ({
    id: group.id,
    name: group.name,
    suppliers: group.commission_group_suppliers.map((entry) => ({
      id: entry.supplier_id,
      name: entry.suppliers[0].name,
      vouchers: entry.suppliers[0].vouchers.map((voucher) => ({
        id: voucher.id,
        name: voucher.name,
        total_commission: voucher.total_commission,
        retailer_commission: voucher.retailer_commission,
        agent_commission: voucher.agent_commission,
      })),
    })),
  }));
};

// Update Voucher Commissions
export const updateVoucherCommissions = async (
  voucherId,
  totalCommission,
  retailerCommission,
  agentCommission,
) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("vouchers")
    .update({
      total_commission: totalCommission,
      retailer_commission: retailerCommission,
      agent_commission: agentCommission,
    })
    .eq("id", voucherId);

  if (error) {
    console.error("Error updating voucher commissions:", error);
    return { error: error.message };
  }

  return { success: true };
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

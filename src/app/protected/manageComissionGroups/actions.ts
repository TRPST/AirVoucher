"use server";

import { encodedRedirect } from "../../../../utils/utils";
import { createClient } from "../../../../utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CommGroup, MobileDataVoucher } from "../../types/common";
import axios from "axios";

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

  try {
    const { data: suppliers, error } = await supabase
      .from("suppliers")
      .select("*");

    if (error) {
      console.error("Error fetching suppliers:", error);
      return { error: error.message };
    }

    if (!suppliers || suppliers.length === 0) {
      console.log("No suppliers found.");
      return { suppliers: [] };
    }

    return { suppliers };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Unexpected error fetching suppliers:", error);
      return { error: error.message };
    }
    return { error: "An unexpected error occurred" };
  }
};

export const getSupplierMainVoucherGroups = async (supplierId: number) => {
  const supabase = await createClient();

  try {
    const { data: mainVoucherGroups, error } = await supabase
      .from("main_voucher_groups")
      .select("*")
      .eq("supplier_id", supplierId);

    if (error) {
      return { error: error.message };
    }

    console.log("Voucher Groups", mainVoucherGroups);

    return { mainVoucherGroups };
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Unexpected error fetching supplier voucher groups:",
        error,
      );
      return { error: error.message };
    }
    return { error: "An unexpected error occurred" };
  }
};

export const getSupplierMobileDataVouchers = async (supplierName: string) => {
  switch (supplierName.toLowerCase()) {
    case "glocell": {
      try {
        const response = await axios.get(
          "https://api.qa.bltelecoms.net/v2/trade/mobile/bundle/products",
          {
            headers: {
              accept: "application/json",
              "Trade-Vend-Channel": "API",
              apikey: process.env.GLOCEL_API_KEY,
              authorization: "Basic YmxkOm9ybnVrM2k5dnNlZWkxMjVzOHFlYTcxa3Vi",
            },
          },
        );

        if (response.status === 200) {
          const filteredVouchers = response.data.filter(
            (voucher: { category: string }) =>
              voucher.category.toLowerCase() === "data",
          );
          return { mobileDataVouchers: filteredVouchers };
        }

        return { error: "Failed to fetch mobile data vouchers" };
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching mobile data vouchers:", error);
          return { error: error.message };
        }
        return { error: "An unexpected error occurred" };
      }
    }
    default:
      return {
        error: "Mobile data vouchers not available for this supplier yet",
      };
  }
};

export const getSupplierMobileAirtimeVouchers = async (
  supplierName: string,
) => {
  switch (supplierName.toLowerCase()) {
    case "glocell": {
      try {
        const response = await axios.get(
          "https://api.qa.bltelecoms.net/v2/trade/mobile/airtime/products",
          {
            headers: {
              accept: "application/json",
              "Trade-Vend-Channel": "API",
              apikey: process.env.GLOCEL_API_KEY,
              authorization: "Basic YmxkOm9ybnVrM2k5dnNlZWkxMjVzOHFlYTcxa3Vi",
            },
          },
        );

        if (response.status === 200) {
          return { mobileAirtimeVouchers: response.data };
        }

        return { error: "Failed to fetch mobile airtime vouchers" };
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching mobile airtime vouchers:", error);
          return { error: error.message };
        }
        return { error: "An unexpected error occurred" };
      }
    }
  }
};

export const getSupplierApis = async (supplierName: string) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("suppliers")
      .select("supplier_apis")
      .eq("supplier_name", supplierName)
      .single();

    if (error) return { error: error.message };
    if (!data?.supplier_apis || data.supplier_apis.length === 0) {
      return { error: "No supplier APIs setup yet" };
    }
    return { supplierApis: data.supplier_apis };
  } catch (error) {
    console.error("Unexpected error fetching supplier APIs:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

//add vouchers to mobile_data_vouchers table
export const addVouchersToMobileDataVouchers = async (
  mobileDataVouchers: MobileDataVoucher[],
) => {
  const supabase = await createClient();

  // Remove any id properties from the vouchers before insertion
  const vouchersToInsert = mobileDataVouchers.map(
    ({ id, ...voucher }) => voucher,
  );

  const { data, error } = await supabase
    .from("mobile_data_vouchers")
    .insert(vouchersToInsert);

  if (error) {
    return { error: error.message };
  }

  return { success: "Mobile data vouchers added successfully" };
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
  voucherId: any,
  totalCommission: any,
  retailerCommission: any,
  agentCommission: any,
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

  const { data: commissionGroups, error } = await supabase.from(
    "commission_groups",
  ).select(`
      id,
      name,
      mobile_data_vouchers (
        id,
        name,
        vendorId,
        amount,
        total_comm,
        retailer_comm,
        sales_agent_comm,
        supplier_id,
        supplier_name,
        profit
      )
    `);

  if (error) {
    return { error: error.message };
  }

  // Transform the data to match expected format
  const formattedGroups = commissionGroups.map((group) => ({
    id: group.id,
    name: group.name,
    vouchers: group.mobile_data_vouchers,
  }));

  return { commissionGroups: formattedGroups };
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

// export const checkCommGroupSignedIn = async () => {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getCommGroup();

//   if (!user) {
//     return redirect("/");
//   }
// };

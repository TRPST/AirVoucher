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

    //console.log("Voucher Groups", mainVoucherGroups);

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

export const getSupplierVoucherProducts = async (supplierName: string) => {
  switch (supplierName.toLowerCase()) {
    case "glocell": {
      try {
        // Fetch both data and airtime products in parallel
        const [dataResponse, airtimeResponse] = await Promise.all([
          axios.get(
            "https://api.qa.bltelecoms.net/v2/trade/mobile/bundle/products",
            {
              headers: {
                accept: "application/json",
                "Trade-Vend-Channel": "API",
                apikey: process.env.GLOCEL_API_KEY,
                authorization: "Basic YmxkOm9ybnVrM2k5dnNlZWkxMjVzOHFlYTcxa3Vi",
              },
            },
          ),
          axios.get(
            "https://api.qa.bltelecoms.net/v2/trade/mobile/airtime/products",
            {
              headers: {
                accept: "application/json",
                "Trade-Vend-Channel": "API",
                apikey: process.env.GLOCEL_API_KEY,
                authorization: "Basic YmxkOm9ybnVrM2k5dnNlZWkxMjVzOHFlYTcxa3Vi",
              },
            },
          ),
        ]);

        if (dataResponse.status === 200 && airtimeResponse.status === 200) {
          const mobileDataVouchers = dataResponse.data.filter(
            (voucher: { category: string }) =>
              voucher.category.toLowerCase() === "data",
          );
          const mobileAirtimeVouchers = dataResponse.data.filter(
            (voucher: { category: string }) =>
              voucher.category.toLowerCase() === "airtime",
          );

          return {
            mobileDataVouchers,
            mobileAirtimeVouchers,
          };
        }

        return { error: "Failed to fetch voucher products" };
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching voucher products:", error);
          return { error: error.message };
        }
        return { error: "An unexpected error occurred" };
      }
    }
    default:
      return {
        error: "Voucher products not available for this supplier yet",
      };
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

  // Process vouchers before insertion
  const vouchersToInsert = mobileDataVouchers.map(({ id, ...voucher }) => {
    // Create a new voucher object with processed values
    const processedVoucher = { ...voucher };

    console.log("mobileDataVouchers", mobileDataVouchers);

    // Convert Glocell voucher amounts from cents to Rand
    if (voucher.supplier_name?.toLowerCase() === "glocell" && voucher.amount) {
      processedVoucher.amount = Number(
        (Number(voucher.amount) / 100).toFixed(2),
      );
    } else if (voucher.amount) {
      // For other suppliers, just round to 2 decimal places
      processedVoucher.amount = Number(Number(voucher.amount).toFixed(2));
    }

    // Round commission and profit values to 2 decimal places
    if (voucher.total_comm !== undefined) {
      processedVoucher.total_comm = Number(
        Number(voucher.total_comm).toFixed(2),
      );
    }

    if (voucher.retailer_comm !== undefined) {
      processedVoucher.retailer_comm = Number(
        Number(voucher.retailer_comm).toFixed(2),
      );
    }

    if (voucher.sales_agent_comm !== undefined) {
      processedVoucher.sales_agent_comm = Number(
        Number(voucher.sales_agent_comm).toFixed(2),
      );
    }

    if (voucher.profit !== undefined) {
      processedVoucher.profit = Number(Number(voucher.profit).toFixed(2));
    }

    return processedVoucher;
  });

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

export const getCommGroupsAction = async () => {
  const supabase = await createClient();

  // First, get all users (admins) data
  const { data: admins, error: adminsError } = await supabase
    .from("users")
    .select("id, name");

  if (adminsError) {
    console.error("Error fetching admins:", adminsError);
    return { error: adminsError.message };
  }

  // Create a map of admin IDs to names
  const adminMap = admins?.reduce(
    (acc, admin) => {
      acc[admin.id] = `${admin.name}`;
      return acc;
    },
    {} as Record<string, string>,
  );

  // Get commission groups data
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
      ),
      retailers (
        id,
        name,
        email,
        contact_number,
        city,
        contact_person,
        active,
        location,
        terminal_access,
        assigned_admin
      )
    `);

  if (error) {
    console.error("Error fetching commission groups:", error);
    return { error: error.message };
  }

  // Transform the data with proper admin names
  const formattedGroups = commissionGroups?.map((group) => ({
    id: group.id,
    name: group.name,
    vouchers: group.mobile_data_vouchers || [],
    retailers:
      group.retailers?.map((retailer) => ({
        ...retailer,
        admin_name: retailer.assigned_admin
          ? adminMap[retailer.assigned_admin] || "Not Found"
          : "Not Assigned",
      })) || [],
  }));

  console.log("Admin Map:", adminMap); // Debug log
  console.log("Formatted Groups:", formattedGroups); // Debug log

  return { commissionGroups: formattedGroups || [] };
};

export const assignCommGroupToRetailer = async (
  retailerId: string,
  commGroupId: string,
) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("retailers")
    .update({ comm_group_id: `${commGroupId}` })
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

  // First, check if there are any retailers assigned to this commission group
  const { data: retailers, error: fetchError } = await supabase
    .from("retailers")
    .select("id")
    .eq("comm_group_id", commGroupId);

  if (fetchError) {
    console.error("Error checking retailers:", fetchError);
    return { error: fetchError.message };
  }

  // If retailers are assigned, update their comm_group_id to null
  if (retailers && retailers.length > 0) {
    const { error: updateError } = await supabase
      .from("retailers")
      .update({ comm_group_id: null })
      .eq("comm_group_id", commGroupId);

    if (updateError) {
      console.error("Error updating retailers:", updateError);
      return { error: updateError.message };
    }
  }

  // Delete any mobile_data_vouchers associated with this commission group
  const { error: deleteVouchersError } = await supabase
    .from("mobile_data_vouchers")
    .delete()
    .eq("comm_group_id", commGroupId);

  if (deleteVouchersError) {
    console.error("Error deleting vouchers:", deleteVouchersError);
    return { error: deleteVouchersError.message };
  }

  // Finally, delete the commission group
  const { error: deleteGroupError } = await supabase
    .from("commission_groups")
    .delete()
    .eq("id", commGroupId);

  if (deleteGroupError) {
    console.error("Error deleting commission group:", deleteGroupError);
    return { error: deleteGroupError.message };
  }

  return { success: "Commission group deleted successfully" };
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

export const editVoucherAction = async (voucher: MobileDataVoucher) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("mobile_data_vouchers")
    .update({
      total_comm: voucher.total_comm,
      retailer_comm: voucher.retailer_comm,
      sales_agent_comm: voucher.sales_agent_comm,
    })
    .eq("id", voucher.id);

  if (error) {
    return { error: error.message };
  }

  return { success: "Voucher updated successfully" };
};

// Add this new action
export const deleteVoucherAction = async (voucherId: string | number) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("mobile_data_vouchers")
    .delete()
    .eq("id", voucherId);

  if (error) {
    return { error: error.message };
  }

  return { success: "Voucher deleted successfully" };
};

export const getTerminalsAction = async (retailerId: string) => {
  const supabase = await createClient();

  interface Terminal {
    id: string;
    cashier_name: string | null;
    active: boolean;
  }

  try {
    const { data, error } = await supabase
      .from("terminals")
      .select("id, cashier_name, active")
      .eq("retailer_id", retailerId);

    if (error) {
      console.error("Error fetching terminals:", error);
      return { error: error.message, terminals: [] as Terminal[] };
    }

    return { terminals: (data || []) as Terminal[], error: null };
  } catch (error) {
    console.error("Unexpected error fetching terminals:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
      terminals: [] as Terminal[],
    };
  }
};

export const getTerminalsByRetailerAction = async (retailerId: string) => {
  try {
    const supabase = await createClient();

    const { data: terminals, error } = await supabase
      .from("terminals")
      .select("*")
      .eq("assigned_retailer", retailerId);

    if (error) {
      console.error("Error fetching terminals:", error);
      return { error: error.message };
    }

    return { terminals };
  } catch (error) {
    console.error("Error in getTerminalsByRetailerAction:", error);
    return { error: "Failed to fetch terminals" };
  }
};

export const editCommGroupNameAction = async (
  commGroupId: string,
  name: string,
) => {
  const supabase = await createClient();

  if (!name.trim()) {
    return { error: "Commission group name is required" };
  }

  const { error } = await supabase
    .from("commission_groups")
    .update({ name })
    .eq("id", commGroupId);

  if (error) {
    console.error("Error updating commission group:", error);
    return { error: error.message };
  }

  return { success: "Commission group updated successfully" };
};

export const removeRetailerFromCommGroupAction = async (retailerId: string) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("retailers")
    .update({ comm_group_id: null })
    .eq("id", retailerId);

  if (error) {
    console.error("Error removing retailer from commission group:", error);
    return { error: error.message };
  }

  return { success: "Retailer removed from commission group successfully" };
};

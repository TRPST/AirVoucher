"use server";

import { createClient } from "../../../../utils/supabase/server";
import { Supplier } from "../../types/supplier";
import { UploadedVoucher } from "./components/VoucherUploadModal";

/**
 * Fetches all vouchers for a specific supplier from the mobile_data_vouchers table
 * @param supplierName The name of the supplier to fetch vouchers for
 * @returns Object containing vouchers or error message
 */
export const getSupplierVouchersAction = async (supplierName: string) => {
  const supabase = await createClient();

  try {
    const { data: vouchers, error } = await supabase
      .from("mobile_data_vouchers")
      .select("*")
      .eq("supplier_name", supplierName);

    if (error) {
      console.error("Error fetching vouchers:", error);
      return { error: error.message };
    }

    return { vouchers: vouchers || [] };
  } catch (error) {
    console.error("Unexpected error fetching vouchers:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

/**
 * Uploads multiple vouchers to the mobile_data_vouchers table
 * @param vouchers Array of vouchers to upload
 * @returns Object containing success status or error message
 */
export const uploadBulkVouchersAction = async (vouchers: UploadedVoucher[]) => {
  const supabase = await createClient();

  try {
    // Prepare vouchers for insertion based on the database schema
    const vouchersToInsert = vouchers.map((voucher) => ({
      category: voucher.category || "data",
      voucher_pin: voucher.voucher_pin || "",
      voucher_serial_number: voucher.voucher_serial_number,
      source: voucher.source || "manual_upload",
      status: voucher.status || "available",
      supplier_id: voucher.supplier_id,
      supplier_name: voucher.supplier_name,
      total_comm: voucher.total_comm || 0,
      retailer_comm: voucher.retailer_comm || 0,
      sales_agent_comm: voucher.sales_agent_comm || 0,
      created_at: new Date().toISOString(),
      name: voucher.name,
      vendorId: voucher.vendorId,
      amount: voucher.amount,
      profit: voucher.profit || 0,
    }));

    // Insert all vouchers in a single operation
    const { data, error } = await supabase
      .from("mobile_data_vouchers")
      .insert(vouchersToInsert);

    if (error) {
      console.error("Error uploading vouchers:", error);
      return { error: error.message };
    }

    return { success: true, count: vouchersToInsert.length };
  } catch (error) {
    console.error("Unexpected error uploading vouchers:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

/**
 * Fetches all suppliers from the suppliers table
 * @returns Object containing suppliers or error message
 */
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

    return { suppliers: suppliers || [] };
  } catch (error) {
    console.error("Unexpected error fetching suppliers:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

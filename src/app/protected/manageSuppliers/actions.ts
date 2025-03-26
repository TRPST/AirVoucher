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
 * Uploads multiple vouchers to the mobile_data_vouchers table, checking for duplicates
 * @param vouchers Array of vouchers to upload
 * @returns Object containing success status or error message
 */
export const uploadBulkVouchersAction = async (vouchers: UploadedVoucher[]) => {
  const supabase = await createClient();

  try {
    // First, get all existing voucher serial numbers for this supplier
    const { data: existingVouchers, error: fetchError } = await supabase
      .from("mobile_data_vouchers")
      .select("voucher_serial_number")
      .eq("supplier_name", vouchers[0]?.supplier_name || "");

    if (fetchError) {
      console.error("Error fetching existing vouchers:", fetchError);
      return { error: fetchError.message };
    }

    // Create a set of existing serial numbers for faster lookup
    const existingSerialNumbers = new Set(
      existingVouchers?.map((v) => v.voucher_serial_number) || [],
    );

    // Filter out vouchers with duplicate serial numbers
    const newVouchers = vouchers.filter(
      (voucher) => !existingSerialNumbers.has(voucher.voucher_serial_number),
    );

    // If all vouchers are duplicates, return early
    if (newVouchers.length === 0) {
      return {
        success: false,
        duplicates: vouchers.length,
        message: "All vouchers already exist in the database.",
      };
    }

    // Prepare vouchers for insertion based on the database schema
    const vouchersToInsert = newVouchers.map((voucher) => ({
      category: voucher.category || "data",
      voucher_pin: voucher.voucher_pin || "",
      voucher_serial_number: voucher.voucher_serial_number,
      source: voucher.source || "manual_upload",
      status: voucher.status || "active",
      expiry_date: voucher.expiry_date || null,
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

    const duplicatesCount = vouchers.length - newVouchers.length;

    return {
      success: true,
      count: newVouchers.length,
      duplicates: duplicatesCount,
      message:
        duplicatesCount > 0
          ? `Successfully uploaded ${newVouchers.length} vouchers. ${duplicatesCount} duplicate vouchers were skipped.`
          : `Successfully uploaded ${newVouchers.length} vouchers.`,
    };
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

/**
 * Checks which vouchers already exist in the database
 * @param supplierName The supplier name to check against
 * @param serialNumbers Array of serial numbers to check
 * @returns Object containing existing serial numbers or error message
 */
export const checkExistingVouchersAction = async (
  supplierName: string,
  serialNumbers: string[],
) => {
  const supabase = await createClient();

  try {
    // Handle empty array case
    if (!serialNumbers || serialNumbers.length === 0) {
      return { existingSerialNumbers: [] };
    }

    // Ensure supplierName is provided
    if (!supplierName) {
      return { error: "Supplier name is required" };
    }

    // Limit the number of serial numbers to check at once (to avoid URL length limits)
    const batchSize = 100;
    let allExistingSerialNumbers: string[] = [];

    // Process in batches
    for (let i = 0; i < serialNumbers.length; i += batchSize) {
      const batch = serialNumbers.slice(i, i + batchSize);

      const { data: existingVouchers, error } = await supabase
        .from("mobile_data_vouchers")
        .select("voucher_serial_number")
        .eq("supplier_name", supplierName)
        .in("voucher_serial_number", batch);

      if (error) {
        console.error("Error checking existing vouchers:", error);
        return { error: error.message };
      }

      // Extract the serial numbers from the results and add to our collection
      const batchExistingSerialNumbers = existingVouchers.map(
        (v) => v.voucher_serial_number,
      );

      allExistingSerialNumbers = [
        ...allExistingSerialNumbers,
        ...batchExistingSerialNumbers,
      ];
    }

    return { existingSerialNumbers: allExistingSerialNumbers };
  } catch (error) {
    console.error("Unexpected error checking existing vouchers:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

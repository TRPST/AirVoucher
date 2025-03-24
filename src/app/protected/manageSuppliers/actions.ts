"use server";

import { createClient } from "../../../../utils/supabase/server";
import { Supplier } from "../../types/supplier";

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
      console.error("Error fetching supplier vouchers:", error);
      return { error: error.message };
    }

    return { vouchers: vouchers || [] };
  } catch (error) {
    console.error("Unexpected error fetching supplier vouchers:", error);
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

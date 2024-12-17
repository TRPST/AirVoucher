"use server";

import { createClient } from "../../utils/supabase/server";

export const saveVoucherToDatabase = async (voucherData: {
  voucher_id: number;
  sale_id: number;
  pin: string;
  amount: number;
}) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("ott_sales").insert({
    voucher_id: voucherData.voucher_id,
    sale_id: voucherData.sale_id,
    pin: voucherData.pin,
    amount: voucherData.amount,
  });

  if (error) {
    console.error("Error saving voucher to database:", error.message);
    return { success: false, message: error.message };
  }

  return { success: true, data };
};

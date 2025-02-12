"use server";

import { createClient } from "../../utils/supabase/server";

export const saveVoucherToDatabase = async (voucherData: {
  pin: any;
  voucher_id: number;
  terminal_id: string;
  sale_id: number;
  amount: number;
}) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("ott_sales").insert({
    voucher_id: voucherData.voucher_id,
    terminal_id: voucherData.terminal_id, // Add terminal_id here
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

// Fetch sales analytics and sales history
export const getSalesAnalyticsAction = async (terminalId: string) => {
  const supabase = await createClient();

  try {
    // Fetch total sales and total revenue for the terminal
    const { data: totalSalesData, error: totalError } = await supabase
      .from("ott_sales")
      .select("amount, issued_at")
      .eq("terminal_id", terminalId);

    if (totalError) throw totalError;

    const totalSales = totalSalesData.length; // Count total sales
    const totalRevenue = totalSalesData.reduce(
      (sum: number, sale: any) => sum + sale.amount,
      0,
    ); // Sum up all amounts

    // Fetch sales trends (last 30 days)
    const trendsByDate: { [date: string]: number } = {};
    totalSalesData.forEach((sale: any) => {
      const date = new Date(sale.issued_at).toISOString().split("T")[0]; // Format as YYYY-MM-DD
      trendsByDate[date] = (trendsByDate[date] || 0) + sale.amount; // Sum amounts by date
    });

    const salesTrends = {
      dates: Object.keys(trendsByDate), // Dates
      amounts: Object.values(trendsByDate), // Corresponding amounts
    };

    // Sales history (all sales with timestamps)
    const salesHistory = totalSalesData.map((sale: any) => ({
      amount: sale.amount,
      issued_at: sale.issued_at,
    }));

    return {
      totalSales,
      totalRevenue,
      salesTrends,
      salesHistory,
    };
  } catch (error) {
    console.error("Error fetching sales analytics:", error);
    throw new Error("Error fetching sales analytics.");
  }
};

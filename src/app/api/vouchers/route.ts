import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.NEXT_PUBLIC_BL_TELECOMS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 },
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const vendor = searchParams.get("vendor");
    const amount = searchParams.get("amount");

    if (!vendor || !amount) {
      return NextResponse.json(
        { error: "Missing required parameters: vendor and amount" },
        { status: 400 },
      );
    }

    // Make the request to the external API
    const response = await axios.get(
      "https://api.live.bltelecoms.net/v2/trade/voucher/products",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        params: {
          vendor,
          amount,
        },
      },
    );

    // Return the response from the external API
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching vouchers:", error);

    // Return a more detailed error message
    return NextResponse.json(
      {
        error: "Failed to fetch vouchers",
        message: error.message,
        status: error.response?.status || 500,
        data: error.response?.data || null,
      },
      { status: error.response?.status || 500 },
    );
  }
}

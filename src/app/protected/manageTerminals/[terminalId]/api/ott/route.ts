import { NextResponse } from "next/server";
import axios from "axios";
import { API_BASE_URL, AUTH_HEADERS } from "../constants";

export async function POST(request: Request) {
  const { amount } = await request.json();
  try {
    const response = await axios.post(
      `${API_BASE_URL}/reseller/v1/GetVoucher`,
      { value: amount },
      { headers: AUTH_HEADERS },
    );
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

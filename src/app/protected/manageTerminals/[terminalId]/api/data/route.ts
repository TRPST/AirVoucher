import { NextResponse } from "next/server";
import axios from "axios";
import { API_BASE_URL, AUTH_HEADERS } from "../constants";

export async function GET() {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/v2/trade/mobile/bundle/products`,
      {
        headers: AUTH_HEADERS,
      },
    );
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

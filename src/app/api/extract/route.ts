import { NextRequest, NextResponse } from "next/server";
import { extractInvoiceDetails } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body.message !== "string" || !body.message.trim()) {
      return NextResponse.json(
        { error: "Invalid request. 'message' field is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    const extraction = await extractInvoiceDetails(body.message.trim());
    return NextResponse.json(extraction, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    
    // Check if error is due to missing API key
    if (errorMessage.includes("OPENROUTER_API_KEY")) {
      return NextResponse.json(
        { error: "Server configuration error: OPENROUTER_API_KEY is not set." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

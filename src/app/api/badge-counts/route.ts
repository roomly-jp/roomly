import { NextResponse } from "next/server";
import { getBadgeCounts } from "@/lib/queries";

export async function GET() {
  try {
    const counts = await getBadgeCounts();
    return NextResponse.json(counts);
  } catch {
    return NextResponse.json(
      { "/rent": 0, "/maintenance": 0, "/inquiries": 0 },
      { status: 500 }
    );
  }
}

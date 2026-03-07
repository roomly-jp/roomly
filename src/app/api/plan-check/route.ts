import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = await createClient();

    const [companyRes, unitsRes] = await Promise.all([
      supabase.from("companies").select("plan, max_units").single(),
      supabase.from("units").select("id", { count: "exact", head: true }),
    ]);

    const plan = companyRes.data?.plan ?? "free";
    const maxUnits = companyRes.data?.max_units ?? 10;
    const currentUnits = unitsRes.count ?? 0;

    return NextResponse.json({
      plan,
      maxUnits,
      currentUnits,
      isOver: currentUnits >= maxUnits,
    });
  } catch {
    return NextResponse.json(
      { plan: "free", maxUnits: 10, currentUnits: 0, isOver: false },
      { status: 200 }
    );
  }
}

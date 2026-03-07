import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// PUT: 送金ステータス更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await createClient();

    const updateData: Record<string, unknown> = {};
    if (body.status) updateData.status = body.status;
    if (body.status === "sent") updateData.sent_date = new Date().toISOString().slice(0, 10);
    if (body.notes !== undefined) updateData.notes = body.notes;

    const { data, error } = await supabase
      .from("owner_remittances")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "送金の更新に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "リクエストの処理に失敗しました" },
      { status: 500 }
    );
  }
}

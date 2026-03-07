import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { tenantSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = tenantSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "バリデーションエラー", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    // 空文字をnullに変換
    const data = Object.fromEntries(
      Object.entries(parsed.data).map(([k, v]) => [k, v === "" ? null : v])
    );

    const { data: tenant, error } = await supabase
      .from("tenants")
      .insert(data)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "入居者の作成に失敗しました", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(tenant, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "リクエストの処理に失敗しました" },
      { status: 500 }
    );
  }
}

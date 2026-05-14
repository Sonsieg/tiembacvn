import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const allowedEntities = new Set(["categories", "collections", "coupons"]);

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get("tiembac_admin_session")?.value !== "authenticated") {
      return NextResponse.json({ error: "Bạn cần đăng nhập admin" }, { status: 401 });
    }

    const body = await request.json();
    const entity = String(body.entity ?? "");
    const id = String(body.id ?? "");
    const active = Boolean(body.active);

    if (!allowedEntities.has(entity)) {
      return NextResponse.json({ error: "Nhóm dữ liệu không hợp lệ" }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json({ error: "Thiếu ID cần cập nhật" }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ id, active, preview: true });
    }

    const { error } = await supabase.from(entity).update({ active }).eq("id", id);
    if (error) throw error;

    return NextResponse.json({ id, active });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể cập nhật trạng thái";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

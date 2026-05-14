import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const statuses = new Set(["draft", "published"]);

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get("tiembac_admin_session")?.value !== "authenticated") {
      return NextResponse.json({ error: "Bạn cần đăng nhập admin" }, { status: 401 });
    }

    const body = await request.json();
    const id = String(body.id ?? "");
    const status = String(body.status ?? "");

    if (!id) return NextResponse.json({ error: "Thiếu ID bài viết" }, { status: 400 });
    if (!statuses.has(status)) return NextResponse.json({ error: "Trạng thái bài viết không hợp lệ" }, { status: 400 });

    const supabase = createSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ id, status, preview: true });
    }

    const payload = status === "published"
      ? { status, published_at: new Date().toISOString() }
      : { status };

    const { error } = await supabase.from("blog_posts").update(payload).eq("id", id);
    if (error) throw error;

    return NextResponse.json({ id, status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể cập nhật bài viết";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

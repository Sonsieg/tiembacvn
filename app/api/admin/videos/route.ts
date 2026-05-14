import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function parseYoutubeId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.slice(1);
    if (parsed.searchParams.get("v")) return parsed.searchParams.get("v");
    const embedMatch = parsed.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/);
    return embedMatch?.[1] ?? null;
  } catch {
    return null;
  }
}

async function requireAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("tiembac_admin_session")?.value === "authenticated";
}

export async function POST(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Bạn cần đăng nhập admin" }, { status: 401 });
    }

    const body = await request.json();
    const productId = String(body.productId ?? "");
    const youtubeUrl = String(body.youtubeUrl ?? "").trim();
    const active = Boolean(body.active);
    const title = String(body.title ?? "Review sản phẩm").trim() || "Review sản phẩm";
    const youtubeId = parseYoutubeId(youtubeUrl);

    if (!productId) return NextResponse.json({ error: "Vui lòng chọn sản phẩm" }, { status: 400 });
    if (!youtubeId) return NextResponse.json({ error: "YouTube URL không hợp lệ" }, { status: 400 });

    const row = {
      product_id: productId,
      youtube_url: youtubeUrl,
      youtube_id: youtubeId,
      title,
      thumbnail_url: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      type: "Review",
      sort_order: Number(body.sortOrder ?? 0),
      featured: false,
      status: active ? "active" : "hidden",
    };

    const supabase = createSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ id: `preview-${Date.now()}`, ...row, preview: true });
    }

    const { data, error } = await supabase.from("product_videos").insert(row).select("*").single();
    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể lưu video";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Bạn cần đăng nhập admin" }, { status: 401 });
    }

    const body = await request.json();
    const id = String(body.id ?? "");
    const productId = String(body.productId ?? "");
    const youtubeUrl = String(body.youtubeUrl ?? "").trim();
    const active = Boolean(body.active);
    const title = String(body.title ?? "Review sản phẩm").trim() || "Review sản phẩm";
    const youtubeId = parseYoutubeId(youtubeUrl);

    if (!id) return NextResponse.json({ error: "Thiếu ID video" }, { status: 400 });
    if (!productId) return NextResponse.json({ error: "Vui lòng chọn sản phẩm" }, { status: 400 });
    if (!youtubeId) return NextResponse.json({ error: "YouTube URL không hợp lệ" }, { status: 400 });

    const row = {
      product_id: productId,
      youtube_url: youtubeUrl,
      youtube_id: youtubeId,
      title,
      thumbnail_url: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      status: active ? "active" : "hidden",
    };

    const supabase = createSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ id, ...row, preview: true });
    }

    const { data, error } = await supabase.from("product_videos").update(row).eq("id", id).select("*").single();
    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể cập nhật video";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

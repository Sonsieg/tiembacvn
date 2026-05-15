import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils/format";

function mapPost(row: Record<string, unknown>) {
  return {
    id: String(row.id ?? ""),
    title: String(row.title ?? ""),
    slug: String(row.slug ?? ""),
    excerpt: String(row.excerpt ?? ""),
    coverImage: String(row.cover_image ?? ""),
    content: Array.isArray(row.content) ? row.content.filter((item): item is string => typeof item === "string") : [],
    publishedAt: String(row.published_at ?? ""),
    status: String(row.status ?? "draft") as "draft" | "published",
    seoTitle: String(row.seo_title ?? row.title ?? ""),
    seoDescription: String(row.seo_description ?? row.excerpt ?? ""),
  };
}

async function requireAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("tiembac_admin_session")?.value === "authenticated";
}

function payloadFromBody(body: Record<string, unknown>) {
  const title = String(body.title ?? "").trim();
  const slug = slugify(String(body.slug ?? title));
  const excerpt = String(body.excerpt ?? "").trim();
  const coverImage = String(body.coverImage ?? "").trim();
  const contentHtml = String(body.contentHtml ?? "").trim();
  const status = String(body.status ?? "draft") === "published" ? "published" : "draft";

  if (!title || !slug || !excerpt || !coverImage || !contentHtml) {
    throw new Error("Vui lòng nhập đủ Tên bài, Mô tả, Ảnh URL, slug và nội dung.");
  }

  return {
    title,
    slug,
    excerpt,
    cover_image: coverImage,
    content: [contentHtml],
    status,
    seo_title: String(body.seoTitle ?? title).trim() || title,
    seo_description: String(body.seoDescription ?? excerpt).trim() || excerpt,
    published_at: status === "published" ? new Date().toISOString() : null,
  };
}

export async function POST(request: Request) {
  try {
    if (!(await requireAdmin())) return NextResponse.json({ error: "Bạn cần đăng nhập admin" }, { status: 401 });
    const payload = payloadFromBody(await request.json());
    const supabase = createSupabaseAdminClient();
    if (!supabase) return NextResponse.json({ post: mapPost({ id: `preview-${Date.now()}`, ...payload }) });

    const { data, error } = await supabase.from("blog_posts").insert(payload).select("*").single();
    if (error) throw error;
    revalidatePath("/journal");
    revalidatePath(`/journal/${payload.slug}`);
    return NextResponse.json({ post: mapPost(data) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể tạo bài viết";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await requireAdmin())) return NextResponse.json({ error: "Bạn cần đăng nhập admin" }, { status: 401 });
    const body = await request.json();
    const id = String(body.id ?? "");
    if (!id) return NextResponse.json({ error: "Thiếu ID bài viết" }, { status: 400 });
    const payload = payloadFromBody(body);
    const supabase = createSupabaseAdminClient();
    if (!supabase) return NextResponse.json({ post: mapPost({ id, ...payload }) });

    const { data, error } = await supabase.from("blog_posts").update(payload).eq("id", id).select("*").single();
    if (error) throw error;
    revalidatePath("/journal");
    revalidatePath(`/journal/${payload.slug}`);
    return NextResponse.json({ post: mapPost(data) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể cập nhật bài viết";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

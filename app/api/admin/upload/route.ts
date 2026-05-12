import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message: "Upload ảnh sẽ dùng Supabase Storage khi cấu hình service role ở server.",
    url: null,
  });
}

"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
  }
  return (
    <button
      type="button"
      className="flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium text-gray-500 transition-none hover:bg-transparent hover:text-gray-500"
      onClick={logout}
    >
      <LogOut className="h-4 w-4" />
      Đăng xuất
    </button>
  );
}

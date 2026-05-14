"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

export function AdminLogoutButton() {
  const router = useRouter();
  const toast = useToast();
  async function logout() {
    const response = await fetch("/api/admin/login", { method: "DELETE" });
    if (!response.ok) {
      toast({ tone: "danger", title: "Đăng xuất thất bại", description: "Vui lòng thử lại." });
      return;
    }
    toast({ tone: "success", title: "Đã đăng xuất", description: "Phiên admin đã kết thúc." });
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

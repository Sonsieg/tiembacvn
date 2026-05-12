"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

type LoginStyles = Record<string, string>;

export function AdminLoginForm({ styles }: { styles: LoginStyles }) {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Không thể đăng nhập");
      return;
    }

    router.replace("/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit}>
      <div className={styles.mark}>
        <Lock size={22} strokeWidth={2.4} />
      </div>
      <p className={styles.eyebrow}>Tiembac Admin</p>
      <h1 className={styles.title}>Đăng nhập quản trị</h1>
      <p className={styles.description}>Dùng tài khoản admin nội bộ để vào dashboard.</p>
      <div className={styles.form}>
        <label className={styles.field}>
          Tài khoản
          <input className={styles.input} value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
        </label>
        <label className={styles.field}>
          Mật khẩu
          <input className={styles.input} value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="xinchaobro123" autoComplete="current-password" />
        </label>
        {error ? <p className={styles.error}>{error}</p> : null}
        <button className={styles.button} disabled={loading}>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</button>
      </div>
      <p className={styles.hint}>Dev account: admin / xinchaobro123</p>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import Image from "next/image";
import logoMark from "@/assets/logo.png";

type LoginStyles = Record<string, string>;

export function AdminLoginForm({ styles }: { styles: LoginStyles }) {
  const router = useRouter();
  const isDevelopment = process.env.NODE_ENV === "development";
  const [username, setUsername] = useState(isDevelopment ? "admin" : "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      <div className={styles.markRow}>
        <span />
        <div className={styles.mark} style={{ backgroundColor: "transparent", border: "none", boxShadow: "none" }}>
           <Image src={logoMark} alt="" priority style={{ objectFit: "contain", width: "90px", height: "auto" }} />
        </div>
        <span />
      </div>
      <p className={styles.eyebrow}>Tiembac.vn Admin</p>
      <h1 className={styles.title}>Đăng nhập</h1>
      <div className={styles.titleDivider}><Sparkles size={18} /></div>
      <p className={styles.description}>Chào mừng bạn trở lại! Vui lòng đăng nhập để tiếp tục quản trị hệ thống Tiembac.vn.</p>
      <div className={styles.form}>
        <label className={styles.field}>
          Email hoặc tài khoản
          <span className={styles.inputWrap}>
            <UserRound size={22} />
            <input className={styles.input} value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Nhập email hoặc tài khoản" autoComplete="username" />
          </span>
        </label>
        <label className={styles.field}>
          Mật khẩu
          <span className={styles.inputWrap}>
            <Lock size={22} />
            <input className={styles.input} value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} placeholder="Nhập mật khẩu" autoComplete="current-password" />
            <button type="button" className={styles.eyeButton} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} onClick={() => setShowPassword((value) => !value)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </span>
        </label>
        {error ? <p className={styles.error}>{error}</p> : null}
        <button className={styles.button} disabled={loading}>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</button>
      </div>
      {isDevelopment ? (
        <p className={styles.hint}>
          <ShieldCheck size={24} />
          <span><strong>Dev account: admin / xinchaobro123</strong>Tài khoản chỉ sử dụng cho môi trường phát triển.</span>
        </p>
      ) : null}
    </form>
  );
}

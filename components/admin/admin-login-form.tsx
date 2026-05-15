"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/components/ui/toast";
import logoMark from "@/assets/logo.png";

type LoginStyles = Record<string, string>;

export function AdminLoginForm({ styles }: { styles: LoginStyles }) {
  const router = useRouter();
  const toast = useToast();
  const isDevelopment = process.env.NODE_ENV === "development";
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState(isDevelopment ? "admin" : "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const canSubmit = username.trim().length > 0 && password.trim().length > 0 && !loading;

  useEffect(() => {
    const syncAutofill = () => {
      const nextUsername = usernameRef.current?.value ?? "";
      const nextPassword = passwordRef.current?.value ?? "";
      if (nextUsername && nextUsername !== username) setUsername(nextUsername);
      if (nextPassword && nextPassword !== password) setPassword(nextPassword);
    };
    syncAutofill();
    const timeout = window.setTimeout(syncAutofill, 250);
    const interval = window.setInterval(syncAutofill, 750);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [username, password]);

  function syncInputValues() {
    const nextUsername = usernameRef.current?.value ?? username;
    const nextPassword = passwordRef.current?.value ?? password;
    setUsername(nextUsername);
    setPassword(nextPassword);
    return { username: nextUsername.trim(), password: nextPassword.trim() };
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = syncInputValues();
    if (!values.username || !values.password || loading) {
      setError("Vui lòng nhập tài khoản và mật khẩu.");
      return;
    }
    setError("");
    setLoading(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const message = data.error ?? "Không thể đăng nhập";
      setError(message);
      toast({ tone: "danger", title: "Đăng nhập thất bại", description: message });
      return;
    }

    toast({ tone: "success", title: "Đăng nhập thành công", description: "Đang chuyển vào trang quản trị." });
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
          <span>Email hoặc tài khoản <span className="text-danger">*</span></span>
          <span className={styles.inputWrap}>
            <UserRound size={22} />
            <input ref={usernameRef} className={styles.input} value={username} onInput={syncInputValues} onChange={(event) => setUsername(event.target.value)} placeholder="Nhập email hoặc tài khoản" autoComplete="username" />
          </span>
        </label>
        <label className={styles.field}>
          <span>Mật khẩu <span className="text-danger">*</span></span>
          <span className={styles.inputWrap}>
            <Lock size={22} />
            <input ref={passwordRef} className={styles.input} value={password} onInput={syncInputValues} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} placeholder="Nhập mật khẩu" autoComplete="current-password" />
            <button type="button" className={styles.eyeButton} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} onClick={() => setShowPassword((value) => !value)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </span>
        </label>
        {error ? <p className={styles.error}>{error}</p> : null}
        <button className={styles.button} disabled={!canSubmit}>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</button>
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

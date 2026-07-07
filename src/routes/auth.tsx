import { FadeInUp } from "@/components/ui/animations";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { Camera, Loader2, Mail, Lock, User as UserIcon, ShieldCheck } from "lucide-react";
import { BackButton } from "@/components/back-button";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Đăng nhập · Picket" },
      { name: "description", content: "Đăng nhập hoặc tạo tài khoản Picket để lưu khoảnh khắc mỗi ngày." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Email không hợp lệ").max(255);
const passwordSchema = z.string().min(6, "Mật khẩu tối thiểu 6 ký tự").max(72);
const nameSchema = z.string().trim().min(1, "Nhập tên hiển thị").max(60);

type Mode = "signin" | "signup";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<null | "google" | "apple">(null);

  // If already signed in, bounce home.
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted && data.session) navigate({ to: "/", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate({ to: "/", replace: true });
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const parsedEmail = emailSchema.safeParse(email);
      if (!parsedEmail.success) throw new Error(parsedEmail.error.issues[0].message);
      const parsedPass = passwordSchema.safeParse(password);
      if (!parsedPass.success) throw new Error(parsedPass.error.issues[0].message);

      // --- MOCK ACCOUNT BYPASS ---
      if (email === "mock@picket.com") {
        localStorage.setItem("mock_user", "true");
        toast.success("Đăng nhập thành công (Mock).");
        navigate({ to: "/" });
        return;
      }
      // ---------------------------

      if (mode === "signup") {
        const parsedName = nameSchema.safeParse(name);
        if (!parsedName.success) throw new Error(parsedName.error.issues[0].message);
        const { error } = await supabase.auth.signUp({
          email: parsedEmail.data,
          password: parsedPass.data,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: parsedName.data },
          },
        });
        if (error) throw error;
        toast.success("Đã gửi mã xác thực đến email của bạn.");
        navigate({ to: "/verify-otp", search: { email: parsedEmail.data } });
        return;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsedEmail.data,
          password: parsedPass.data,
        });
        if (error) {
          // If unverified, redirect to OTP verify
          if (error.message.toLowerCase().includes("not confirmed") || error.message.toLowerCase().includes("email not")) {
            await supabase.auth.resend({ type: "signup", email: parsedEmail.data });
            toast.info("Tài khoản chưa xác thực. Đã gửi lại mã.");
            navigate({ to: "/verify-otp", search: { email: parsedEmail.data } });
            return;
          }
          throw error;
        }
        toast.success("Đăng nhập thành công.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Có lỗi xảy ra";
      // Map common Supabase errors to friendlier Vietnamese
      const friendly =
        msg.includes("Invalid login credentials") ? "Email hoặc mật khẩu không đúng." :
        msg.includes("already registered") || msg.includes("User already registered") ? "Email đã được sử dụng." :
        msg;
      toast.error(friendly);
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider: "google" | "apple") {
    setOauthLoading(provider);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error instanceof Error ? result.error : new Error(String(result.error));
      // If redirected, browser navigates away.
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Không thể đăng nhập";
      toast.error(msg);
      setOauthLoading(null);
    }
  }

  return (
    <FadeInUp className="h-full flex flex-col w-full flex-1"><main className="flex min-h-screen items-center justify-center bg-[#F5E8DA] sm:p-4">
      <div className="relative mx-auto flex h-[100dvh] w-full sm:max-w-[390px] sm:h-[844px] sm:max-h-[calc(100vh-32px)] flex-col overflow-hidden sm:rounded-[44px] bg-[#f4f8fb] sm:shadow-2xl sm:ring-[6px] sm:ring-white">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[62%] bg-gradient-to-b from-[#FFE9D9] via-[#f0f6fa] to-transparent" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#fecaca] opacity-60 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 top-40 h-56 w-56 rounded-full bg-[#FFB4A2] opacity-45 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 right-0 h-52 w-52 rounded-full bg-[#f9a8a8] opacity-35 blur-3xl" />

        <div className="relative flex min-h-[780px] w-full flex-col px-6 pb-6 pt-6">

        {/* Top bar */}
        <div className="flex items-center justify-between">
          <BackButton fallback="/" />
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-foreground/45">
            Picket · Diary
          </p>
          <span className="h-10 w-10" />
        </div>

        {/* Hero */}
        <div className="mt-10 flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-br from-[#f9a8a8] to-[#FFB4A2] opacity-60 blur-2xl" />
            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/70 bg-white/80 text-[#B5828C] shadow-[0_12px_32px_-12px_rgba(46,107,138,0.45)] backdrop-blur-xl">
              <Camera className="h-7 w-7" strokeWidth={2.2} />
            </div>
          </div>
          <h1 className="mt-6 whitespace-pre-line font-display text-[30px] font-bold leading-[1.1] tracking-tight text-foreground">
            {mode === "signin" ? "Chào mừng\ntrở lại" : "Bắt đầu\nhành trình"}
          </h1>
          <p className="mt-3 max-w-[280px] font-sans text-[13px] font-medium leading-relaxed text-foreground/55">
            {mode === "signin"
              ? "Đăng nhập để tiếp tục lưu lại những khoảnh khắc nhỏ mỗi ngày."
              : "Tạo tài khoản trong vài giây và lưu giữ những ngày đáng nhớ."}
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 rounded-[32px] border border-white/70 bg-white/75 p-5 shadow-[0_24px_60px_-30px_rgba(15,42,66,0.35)] backdrop-blur-2xl">
          {/* Tabs */}
          <div className="relative flex rounded-2xl bg-[#F5E8DA] p-1">
            <div
              className="absolute inset-y-1 w-[calc(50%-4px)] rounded-xl bg-white shadow-[0_6px_16px_-8px_rgba(46,107,138,0.35)] transition-all duration-300 ease-out"
              style={{ transform: mode === "signin" ? "translateX(4px)" : "translateX(calc(100% + 4px))" }}
            />
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`relative z-10 flex-1 rounded-xl px-3 py-2.5 font-sans text-[13px] font-semibold transition-colors ${
                  mode === m ? "text-[#B5828C]" : "text-foreground/50"
                }`}
              >
                {m === "signin" ? "Đăng nhập" : "Đăng ký"}
              </button>
            ))}
          </div>

          {/* Social */}
          <div className="mt-5 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={oauthLoading !== null || loading}
              className="flex h-12 items-center justify-center gap-2.5 rounded-2xl border border-black/[0.06] bg-white font-sans text-[13.5px] font-semibold text-foreground shadow-[0_2px_8px_-4px_rgba(15,42,66,0.15)] transition active:scale-[0.97] disabled:opacity-60"
            >
              {oauthLoading === "google" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <GoogleIcon className="h-[18px] w-[18px]" />
              )}
              Tiếp tục với Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("apple")}
              disabled={oauthLoading !== null || loading}
              className="flex h-12 items-center justify-center gap-2.5 rounded-2xl bg-[#0a0a0a] font-sans text-[13.5px] font-semibold text-white shadow-[0_10px_24px_-14px_rgba(0,0,0,0.6)] transition active:scale-[0.97] disabled:opacity-60"
            >
              {oauthLoading === "apple" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <AppleIcon className="h-[18px] w-[18px]" />
              )}
              Tiếp tục với Apple
            </button>
          </div>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-black/[0.07]" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-foreground/40">
              hoặc email
            </span>
            <div className="h-px flex-1 bg-black/[0.07]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
            {mode === "signup" && (
              <Field
                label="Tên hiển thị"
                icon={<UserIcon className="h-[18px] w-[18px]" strokeWidth={2.2} />}
                type="text"
                placeholder="VD: Minh Anh"
                value={name}
                onChange={setName}
                autoComplete="name"
              />
            )}
            <Field
              label="Email"
              icon={<Mail className="h-[18px] w-[18px]" strokeWidth={2.2} />}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
              autoComplete="email"
            />
            <Field
              label="Mật khẩu"
              icon={<Lock className="h-[18px] w-[18px]" strokeWidth={2.2} />}
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              value={password}
              onChange={setPassword}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />

            {mode === "signin" && (
              <div className="-mt-0.5 flex justify-end">
                <button
                  type="button"
                  onClick={async () => {
                    const parsed = emailSchema.safeParse(email);
                    if (!parsed.success) {
                      toast.error("Nhập email trước khi đặt lại mật khẩu");
                      return;
                    }
                    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
                      redirectTo: `${window.location.origin}/reset-password`,
                    });
                    if (error) toast.error(error.message);
                    else toast.success("Đã gửi link đặt lại mật khẩu vào email.");
                  }}
                  className="font-sans text-[11.5px] font-semibold text-[#B5828C]/80 hover:text-[#B5828C]"
                >
                  Quên mật khẩu?
                </button>
              </div>
            )}


            <button
              type="submit"
              disabled={loading || oauthLoading !== null}
              className="relative mt-2 flex h-[52px] items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#B5828C] font-sans text-[14px] font-bold tracking-wide text-white shadow-[0_18px_40px_-16px_rgba(46,107,138,0.7)] transition active:scale-[0.97] disabled:opacity-60"
            >
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0" />
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Đăng nhập" : "Tạo tài khoản"}
            </button>
            
            <div className="mt-2 flex items-center justify-center gap-1.5 text-foreground/40">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="font-sans text-[10px] font-bold uppercase tracking-wider">Mã hoá dữ liệu 256-bit</span>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 text-center">
          <p className="font-sans text-[11.5px] font-medium leading-relaxed text-foreground/50">
            {mode === "signin" ? (
              <>Chưa có tài khoản?{" "}
                <button onClick={() => setMode("signup")} className="font-bold text-[#B5828C]">
                  Đăng ký ngay
                </button>
              </>
            ) : (
              <>Đã có tài khoản?{" "}
                <button onClick={() => setMode("signin")} className="font-bold text-[#B5828C]">
                  Đăng nhập
                </button>
              </>
            )}
          </p>
          <p className="mt-3 px-6 font-sans text-[10.5px] leading-relaxed text-foreground/35">
            Khi tiếp tục, bạn đồng ý với <span className="font-semibold text-foreground/55">Điều khoản</span> &{" "}
            <span className="font-semibold text-foreground/55">Chính sách</span> của Picket.
          </p>
        </div>
        </div>
      </div>
    </main></FadeInUp>

  );
}

function Field({
  label,
  icon,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <label className="group flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white px-4 py-2.5 shadow-[0_1px_3px_rgba(15,42,66,0.04)] transition focus-within:border-[#B5828C]/30 focus-within:ring-4 focus-within:ring-[#B5828C]/10">
      <span className="text-foreground/40 transition group-focus-within:text-[#B5828C]">{icon}</span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/40">
          {label}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full bg-transparent font-sans text-[14px] font-semibold text-foreground placeholder:font-medium placeholder:text-foreground/30 focus:outline-none"
        />
      </div>
    </label>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16.3 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 34.9 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.4 39.6 16.1 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.2 5.2C41.9 34.6 44 29.7 44 24c0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.42 2.23-1.19 3.05-.83.9-2.17 1.6-3.28 1.5-.14-1.1.43-2.24 1.17-3 .82-.86 2.23-1.5 3.3-1.55zM20.5 17.06c-.55 1.28-.82 1.85-1.53 2.98-.99 1.58-2.39 3.55-4.12 3.57-1.54.01-1.94-1-4.03-.99-2.09.01-2.53 1.01-4.07.99-1.73-.02-3.06-1.8-4.05-3.38C.14 15.63-.14 10.5 1.96 7.94 3.44 6.12 5.79 5 8 5c2.25 0 3.66 1.24 5.53 1.24 1.81 0 2.91-1.24 5.51-1.24 1.97 0 4.06 1.07 5.55 2.93-4.87 2.67-4.08 9.63-.09 9.13z"/>
    </svg>
  );
}

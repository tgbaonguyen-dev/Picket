import { FadeInUp } from "@/components/ui/animations";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { KeyRound, Loader2, Lock } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Đặt lại mật khẩu · Picket" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

const passwordSchema = z.string().min(6, "Tối thiểu 6 ký tự").max(72);

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Supabase auto-detects recovery token in URL and creates a session
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = passwordSchema.safeParse(password);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (password !== confirm) {
      toast.error("Mật khẩu nhập lại không khớp");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Đã cập nhật mật khẩu");
    navigate({ to: "/", replace: true });
  }

  return (
    <FadeInUp className="h-full flex flex-col w-full flex-1"><main className="flex min-h-screen items-center justify-center bg-[#F5E8DA] sm:p-4">
      <div className="relative mx-auto flex h-[100dvh] w-full sm:max-w-[390px] sm:h-[844px] sm:max-h-[calc(100vh-32px)] flex-col overflow-hidden sm:rounded-[44px] bg-[#f4f8fb] sm:shadow-2xl sm:ring-[6px] sm:ring-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-[#FFE9D9] via-[#f0f6fa] to-transparent" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#fecaca] opacity-60 blur-3xl" />

        <div className="relative flex min-h-[780px] w-full flex-col px-6 pb-6 pt-6">
          <div className="flex items-center justify-between">
            <BackButton fallback="/auth" />
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-foreground/45">
              Mật khẩu mới
            </p>
            <span className="h-10 w-10" />
          </div>

          <div className="mt-8 flex flex-col items-center text-center">
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-br from-[#f9a8a8] to-[#FFB4A2] opacity-60 blur-2xl" />
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/70 bg-white/85 text-[#B5828C] shadow-[0_12px_32px_-12px_rgba(46,107,138,0.45)] backdrop-blur-xl">
                <KeyRound className="h-7 w-7" strokeWidth={2.2} />
              </div>
            </div>
            <h1 className="mt-6 font-display text-[26px] font-bold leading-tight tracking-tight text-foreground">
              Đặt lại mật khẩu
            </h1>
            <p className="mt-2 max-w-[280px] font-sans text-[13px] font-medium leading-relaxed text-foreground/55">
              {ready
                ? "Nhập mật khẩu mới bạn muốn sử dụng."
                : "Đang xác minh liên kết đặt lại..."}
            </p>
          </div>

          {ready && (
            <form onSubmit={submit} className="mt-8 flex flex-col gap-2.5">
              <PasswordField
                label="Mật khẩu mới"
                value={password}
                onChange={setPassword}
                autoComplete="new-password"
              />
              <PasswordField
                label="Nhập lại"
                value={confirm}
                onChange={setConfirm}
                autoComplete="new-password"
              />
              <button
                type="submit"
                disabled={saving}
                className="mt-2 flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#B5828C] font-sans text-[14px] font-bold text-white shadow-[0_18px_40px_-16px_rgba(46,107,138,0.7)] transition active:scale-[0.97] disabled:opacity-60"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Cập nhật mật khẩu
              </button>
            </form>
          )}
        </div>
      </div>
    </main></FadeInUp>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <label className="group flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white px-4 py-2.5 shadow-sm transition focus-within:border-[#B5828C]/30 focus-within:ring-4 focus-within:ring-[#B5828C]/10">
      <Lock className="h-[18px] w-[18px] text-foreground/40 group-focus-within:text-[#B5828C]" strokeWidth={2.2} />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/40">
          {label}
        </span>
        <input
          type="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder="••••••••"
          className="w-full bg-transparent font-sans text-[14px] font-semibold text-foreground placeholder:font-medium placeholder:text-foreground/30 focus:outline-none"
        />
      </div>
    </label>
  );
}

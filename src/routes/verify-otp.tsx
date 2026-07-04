import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { MailCheck, Loader2 } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const searchSchema = z.object({
  email: z.string().email().optional(),
});

export const Route = createFileRoute("/verify-otp")({
  head: () => ({
    meta: [
      { title: "Xác thực · Picket" },
      { name: "robots", content: "noindex" },
    ],
  }),
  validateSearch: (s) => searchSchema.parse(s),
  component: VerifyOtpPage,
});

const CODE_LEN = 6;

function VerifyOtpPage() {
  const navigate = useNavigate();
  const { email } = useSearch({ from: "/verify-otp" });
  const [digits, setDigits] = useState<string[]>(Array(CODE_LEN).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!email) navigate({ to: "/auth", replace: true });
  }, [email, navigate]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const setDigit = (i: number, v: string) => {
    const clean = v.replace(/\D/g, "").slice(0, 1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = clean;
      return next;
    });
    if (clean && i < CODE_LEN - 1) refs.current[i + 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LEN);
    if (!text) return;
    e.preventDefault();
    const next = Array(CODE_LEN).fill("");
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    refs.current[Math.min(text.length, CODE_LEN - 1)]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < CODE_LEN - 1) refs.current[i + 1]?.focus();
  };

  async function verify(code?: string) {
    if (!email) return;
    const token = (code ?? digits.join("")).trim();
    if (token.length !== CODE_LEN) {
      toast.error("Nhập đủ 6 chữ số");
      return;
    }
    setVerifying(true);
    const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
    setVerifying(false);
    if (error) {
      toast.error(
        error.message.includes("expired") ? "Mã đã hết hạn, gửi lại giúp bạn nhé." :
        error.message.includes("Invalid") ? "Mã không đúng. Kiểm tra lại email." :
        error.message,
      );
      return;
    }
    toast.success("Xác thực thành công!");
    navigate({ to: "/", replace: true });
  }

  // Auto submit when all digits filled
  useEffect(() => {
    const code = digits.join("");
    if (code.length === CODE_LEN && !verifying) verify(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits]);

  async function resend() {
    if (!email || cooldown > 0) return;
    setResending(true);
    const { error } = await supabase.auth.resend({ type: "signup", email });
    setResending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Đã gửi lại mã. Kiểm tra email nhé.");
    setCooldown(60);
  }

  if (!email) return null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5E8DA] sm:p-4">
      <div className="relative mx-auto flex h-[100dvh] w-full sm:max-w-[390px] sm:h-[844px] sm:max-h-[calc(100vh-32px)] flex-col overflow-hidden sm:rounded-[44px] bg-[#f4f8fb] sm:shadow-2xl sm:ring-[6px] sm:ring-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-[#FFE9D9] via-[#f0f6fa] to-transparent" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#fecaca] opacity-60 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 top-40 h-56 w-56 rounded-full bg-[#FFB4A2] opacity-45 blur-3xl" />

        <div className="relative flex min-h-[780px] w-full flex-col px-6 pb-6 pt-6">
          <div className="flex items-center justify-between">
            <BackButton fallback="/auth" />
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-foreground/45">
              Xác thực
            </p>
            <span className="h-10 w-10" />
          </div>

          <div className="mt-8 flex flex-col items-center text-center">
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-br from-[#f9a8a8] to-[#FFB4A2] opacity-60 blur-2xl" />
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/70 bg-white/85 text-[#B5828C] shadow-[0_12px_32px_-12px_rgba(46,107,138,0.45)] backdrop-blur-xl">
                <MailCheck className="h-7 w-7" strokeWidth={2.2} />
              </div>
            </div>
            <h1 className="mt-6 font-display text-[26px] font-bold leading-tight tracking-tight text-foreground">
              Kiểm tra email
            </h1>
            <p className="mt-2 max-w-[300px] font-sans text-[13px] font-medium leading-relaxed text-foreground/55">
              Nhập mã 6 chữ số vừa gửi tới
              <br />
              <span className="font-bold text-foreground/80">{email}</span>
            </p>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => onKeyDown(i, e)}
                onPaste={onPaste}
                className={`h-14 w-11 rounded-2xl border bg-white text-center font-display text-[22px] font-bold tabular-nums text-foreground shadow-sm transition focus:outline-none ${
                  d
                    ? "border-[#B5828C]/50 ring-4 ring-[#B5828C]/10"
                    : "border-black/[0.06] focus:border-[#B5828C]/40 focus:ring-4 focus:ring-[#B5828C]/10"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => verify()}
            disabled={verifying || digits.join("").length !== CODE_LEN}
            className="mt-8 flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#B5828C] font-sans text-[14px] font-bold text-white shadow-[0_18px_40px_-16px_rgba(46,107,138,0.7)] transition active:scale-[0.98] disabled:opacity-50"
          >
            {verifying && <Loader2 className="h-4 w-4 animate-spin" />}
            Xác nhận
          </button>

          <div className="mt-5 flex flex-col items-center gap-1 text-center">
            <p className="font-sans text-[12px] font-medium text-foreground/55">
              Không nhận được mã?
            </p>
            <button
              type="button"
              onClick={resend}
              disabled={cooldown > 0 || resending}
              className="font-sans text-[13px] font-bold text-[#B5828C] disabled:text-foreground/35"
            >
              {resending ? "Đang gửi..." : cooldown > 0 ? `Gửi lại sau ${cooldown}s` : "Gửi lại mã"}
            </button>
          </div>

          <div className="mt-auto pt-6 text-center">
            <p className="px-4 font-sans text-[10.5px] leading-relaxed text-foreground/35">
              Mã có hiệu lực trong 60 phút. Nếu không thấy email, kiểm tra hộp thư rác.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

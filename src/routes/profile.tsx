import { getCurrencies, getTimezones, getLanguages, getDateFormats } from "@/data";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  User,
  Wallet,
  Globe2,
  Clock,
  Languages,
  CalendarDays,
  Palette,
  Bell,
  Fingerprint,
  ShieldCheck,
  HelpCircle,
  FileText,
  Star,
  LogOut,
  ChevronRight,
  Camera,
  Trash2,
  Download,
  Check,
  Tag,
} from "lucide-react";
import { PhoneFrame } from "@/components/phone-frame";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Hồ sơ & Cài đặt · Picket" },
      { name: "description", content: "Quản lý hồ sơ, tiền tệ, múi giờ và các tuỳ chọn khác của bạn trong Picket." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

// ---------- Preferences (localStorage) ----------

type Prefs = {
  currency: string;
  timezone: string;
  language: string;
  dateFormat: string;
  weekStart: "mon" | "sun";
  theme: "system" | "light" | "dark";
  numberFormat: "1,234.56" | "1.234,56" | "1 234,56";
  notifBills: boolean;
  notifBudget: boolean;
  notifWeekly: boolean;
  biometric: boolean;
};

const DEFAULT_PREFS: Prefs = {
  currency: "VND",
  timezone: "Asia/Ho_Chi_Minh",
  language: "vi",
  dateFormat: "DD/MM/YYYY",
  weekStart: "mon",
  theme: "system",
  numberFormat: "1.234,56",
  notifBills: true,
  notifBudget: true,
  notifWeekly: false,
  biometric: false,
};

const PREFS_KEY = "picket.prefs";

function loadPrefs(): Prefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

function savePrefs(p: Prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

// ---------- Options ----------








const NUMBER_FORMATS: Prefs["numberFormat"][] = ["1.234,56", "1,234.56", "1 234,56"];

// ---------- Small components ----------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <p className="mb-2 px-1 font-sans text-[10.5px] font-bold uppercase tracking-[0.18em] text-foreground/50">
        {title}
      </p>
      <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/85 shadow-sm backdrop-blur">
        {children}
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  onClick,
  right,
  danger,
}: {
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value?: string;
  onClick?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
}) {
  const clickable = !!onClick;
  const Comp: React.ElementType = clickable ? "button" : "div";
  return (
    <Comp
      type={clickable ? "button" : undefined}
      onClick={onClick}
      className={`flex w-full items-center gap-3 border-b border-foreground/[0.06] px-4 py-3 text-left last:border-b-0 ${
        clickable ? "transition active:bg-foreground/[0.04]" : ""
      }`}
    >
      {Icon && (
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            danger ? "bg-[#ffe4e6] text-[#b03a4a]" : "bg-[#FFE9D9] text-[#B5828C]"
          }`}
        >
          <Icon className="h-[17px] w-[17px]" strokeWidth={2.2} />
        </span>
      )}
      <span className={`min-w-0 flex-1 font-sans text-[14px] font-semibold ${danger ? "text-[#b03a4a]" : "text-foreground"}`}>
        {label}
      </span>
      {right ??
        (value !== undefined ? (
          <span className="flex items-center gap-1 font-sans text-[12.5px] font-medium text-foreground/55">
            {value}
            {clickable && <ChevronRight className="h-4 w-4" strokeWidth={2.2} />}
          </span>
        ) : clickable ? (
          <ChevronRight className="h-4 w-4 text-foreground/40" strokeWidth={2.2} />
        ) : null)}
    </Comp>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative flex h-6 w-11 shrink-0 items-center rounded-full transition ${
        on ? "bg-[#B5828C]" : "bg-foreground/20"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
          on ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

function PickerSheet<T extends string>({
  open,
  title,
  options,
  value,
  onSelect,
  onClose,
  render,
}: {
  open: boolean;
  title: string;
  options: T[];
  value: T;
  onSelect: (v: T) => void;
  onClose: () => void;
  render?: (v: T) => React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" />
      <div
        className="relative w-full rounded-t-[28px] bg-white p-4 pb-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-foreground/15" />
        <p className="mb-2 px-1 font-display text-[16px] font-bold text-foreground">{title}</p>
        <ul className="max-h-[55vh] overflow-y-auto">
          {options.map((opt) => {
            const selected = opt === value;
            return (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(opt);
                    onClose();
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left font-sans text-[13.5px] transition ${
                    selected ? "bg-[#FFE9D9] font-bold text-foreground" : "font-medium text-foreground/80 hover:bg-foreground/[0.04]"
                  }`}
                >
                  <span className="min-w-0 flex-1 truncate">{render ? render(opt) : opt}</span>
                  {selected && <Check className="h-4 w-4 text-[#B5828C]" strokeWidth={2.6} />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// ---------- Main page ----------

function ProfilePage() {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);

  const [picker, setPicker] = useState<
    null | "currency" | "timezone" | "language" | "dateFormat" | "weekStart" | "theme" | "numberFormat"
  >(null);

  useEffect(() => {
    setPrefs(loadPrefs());
  }, []);

  useEffect(() => {
    let mounted = true;
    async function load(userId: string | undefined, meta: Record<string, unknown> | undefined, mail: string | null | undefined) {
      if (!mounted) return;
      
      const isMock = localStorage.getItem("mock_user") === "true";
      
      if (!userId && !isMock) {
        setSignedIn(false);
        setDisplayName("Khách");
        setEmail("");
        setAvatarUrl(null);
        return;
      }
      
      setSignedIn(true);
      
      if (isMock) {
        setDisplayName("Bạn (Mock)");
        setEmail("mock@picket.com");
        return;
      }

      setEmail(mail ?? "");
      const { data } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", userId!)
        .maybeSingle();
      const fallback =
        (meta?.display_name as string | undefined) ??
        (meta?.full_name as string | undefined) ??
        (meta?.name as string | undefined) ??
        (mail ? mail.split("@")[0] : "bạn");
      if (!mounted) return;
      setDisplayName(data?.display_name ?? fallback);
      setAvatarUrl(data?.avatar_url ?? (meta?.avatar_url as string | undefined) ?? null);
    }
    supabase.auth.getUser().then(({ data }) => {
      load(data.user?.id, data.user?.user_metadata, data.user?.email);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      load(session?.user?.id, session?.user?.user_metadata, session?.user?.email);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const update = (patch: Partial<Prefs>) => {
    setPrefs((p) => {
      const next = { ...p, ...patch };
      savePrefs(next);
      return next;
    });
  };

  async function handleSaveName() {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      toast.error("Tên không được để trống");
      return;
    }
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (!uid) {
      setDisplayName(trimmed);
      setEditName(false);
      setSaving(false);
      toast.success("Đã lưu (chế độ khách)");
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: uid, display_name: trimmed }, { onConflict: "id" });
    setSaving(false);
    if (error) {
      toast.error("Không lưu được: " + error.message);
      return;
    }
    setDisplayName(trimmed);
    setEditName(false);
    toast.success("Đã cập nhật tên");
  }

  async function handleSignOut() {
    localStorage.removeItem("mock_user");
    await supabase.auth.signOut();
    toast.success("Đã đăng xuất");
    navigate({ to: "/" });
  }

  const currencyLabel = useMemo(() => {
    const c = getCurrencies().find((x) => x.code === prefs.currency);
    return c ? `${c.symbol} · ${c.code}` : prefs.currency;
  }, [prefs.currency]);
  const languageLabel = useMemo(
    () => getLanguages().find((l) => l.code === prefs.language)?.label ?? prefs.language,
    [prefs.language],
  );
  const themeLabel = prefs.theme === "system" ? "Theo hệ thống" : prefs.theme === "light" ? "Sáng" : "Tối";
  const weekLabel = prefs.weekStart === "mon" ? "Thứ hai" : "Chủ nhật";

  const overlay = (
    <>
      <PickerSheet
        open={picker === "currency"}
        title="Chọn tiền tệ"
        options={getCurrencies().map((c) => c.code)}
        value={prefs.currency}
        onSelect={(v) => update({ currency: v })}
        onClose={() => setPicker(null)}
        render={(code) => {
          const c = getCurrencies().find((x) => x.code === code);
          return (
            <span className="flex items-center justify-between gap-3">
              <span>
                <span className="font-bold">{c?.symbol}</span> {c?.label}
              </span>
              <span className="text-[11px] font-semibold text-foreground/50">{code}</span>
            </span>
          );
        }}
      />
      <PickerSheet
        open={picker === "timezone"}
        title="Chọn múi giờ"
        options={getTimezones()}
        value={prefs.timezone}
        onSelect={(v) => update({ timezone: v })}
        onClose={() => setPicker(null)}
      />
      <PickerSheet
        open={picker === "language"}
        title="Ngôn ngữ"
        options={getLanguages().map((l) => l.code)}
        value={prefs.language}
        onSelect={(v) => update({ language: v })}
        onClose={() => setPicker(null)}
        render={(code) => getLanguages().find((l) => l.code === code)?.label ?? code}
      />
      <PickerSheet
        open={picker === "dateFormat"}
        title="Định dạng ngày"
        options={getDateFormats() as unknown as string[]}
        value={prefs.dateFormat}
        onSelect={(v) => update({ dateFormat: v })}
        onClose={() => setPicker(null)}
      />
      <PickerSheet
        open={picker === "numberFormat"}
        title="Định dạng số"
        options={NUMBER_FORMATS}
        value={prefs.numberFormat}
        onSelect={(v) => update({ numberFormat: v })}
        onClose={() => setPicker(null)}
      />
      <PickerSheet
        open={picker === "weekStart"}
        title="Tuần bắt đầu từ"
        options={["mon", "sun"] as const as unknown as ("mon" | "sun")[]}
        value={prefs.weekStart}
        onSelect={(v) => update({ weekStart: v })}
        onClose={() => setPicker(null)}
        render={(v) => (v === "mon" ? "Thứ hai" : "Chủ nhật")}
      />
      <PickerSheet
        open={picker === "theme"}
        title="Chủ đề"
        options={["system", "light", "dark"] as const as unknown as ("system" | "light" | "dark")[]}
        value={prefs.theme}
        onSelect={(v) => update({ theme: v })}
        onClose={() => setPicker(null)}
        render={(v) => (v === "system" ? "Theo hệ thống" : v === "light" ? "Sáng" : "Tối")}
      />
    </>
  );

  return (
    <PhoneFrame title="Hồ sơ" subtitle="Tài khoản của bạn" overlay={overlay}>
      <div className="relative px-5 pb-6">
        {/* Profile card */}
        <div className="mt-1 flex items-center gap-3 rounded-3xl border border-white/70 bg-white/85 p-4 shadow-sm">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFE9D9] to-[#ffe4e6] text-[#B5828C] ring-2 ring-white">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <User className="h-8 w-8" strokeWidth={2.2} />
              )}
            </div>
            <button
              type="button"
              aria-label="Đổi ảnh"
              onClick={() => toast("Tính năng đổi ảnh sắp có")}
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#B5828C] text-white shadow"
            >
              <Camera className="h-3 w-3" strokeWidth={2.4} />
            </button>
          </div>
          <div className="min-w-0 flex-1">
            {editName ? (
              <div className="flex flex-col gap-2">
                <input
                  autoFocus
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full rounded-xl border border-foreground/15 bg-white px-3 py-2 font-sans text-[14px] font-semibold text-foreground outline-none focus:border-[#B5828C]"
                  placeholder="Tên hiển thị"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleSaveName}
                    className="rounded-xl bg-[#B5828C] px-3 py-1.5 font-sans text-[12px] font-bold text-white disabled:opacity-60"
                  >
                    {saving ? "Đang lưu…" : "Lưu"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditName(false)}
                    className="rounded-xl bg-foreground/[0.06] px-3 py-1.5 font-sans text-[12px] font-semibold text-foreground/70"
                  >
                    Huỷ
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="truncate font-display text-[18px] font-bold text-foreground">{displayName || "Bạn"}</p>
                <p className="truncate font-sans text-[12px] font-medium text-foreground/55">
                  {email || (signedIn ? "" : "Chưa đăng nhập")}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setNameInput(displayName);
                    setEditName(true);
                  }}
                  className="mt-1 font-sans text-[11.5px] font-bold uppercase tracking-wider text-[#B5828C]"
                >
                  Sửa tên hiển thị
                </button>
              </>
            )}
          </div>
        </div>

        {!signedIn && (
          <Link
            to="/auth"
            className="mt-3 flex h-11 items-center justify-center rounded-2xl bg-[#B5828C] font-sans text-[13px] font-bold text-white shadow-[0_14px_30px_-14px_rgba(181,130,140,0.7)] active:scale-[0.98]"
          >
            Đăng nhập / Tạo tài khoản
          </Link>
        )}

        {/* Bản địa hoá */}
        <Section title="Bản địa hoá">
          <Row icon={Wallet} label="Tiền tệ" value={currencyLabel} onClick={() => setPicker("currency")} />
          <Row icon={Clock} label="Múi giờ" value={prefs.timezone} onClick={() => setPicker("timezone")} />
          <Row icon={Languages} label="Ngôn ngữ" value={languageLabel} onClick={() => setPicker("language")} />
          <Row icon={CalendarDays} label="Định dạng ngày" value={prefs.dateFormat} onClick={() => setPicker("dateFormat")} />
          <Row icon={Globe2} label="Định dạng số" value={prefs.numberFormat} onClick={() => setPicker("numberFormat")} />
          <Row icon={CalendarDays} label="Tuần bắt đầu" value={weekLabel} onClick={() => setPicker("weekStart")} />
        </Section>

        {/* Giao diện */}
        <Section title="Giao diện">
          <Row icon={Palette} label="Chủ đề" value={themeLabel} onClick={() => setPicker("theme")} />
        </Section>

        {/* Thông báo */}
        <Section title="Thông báo">
          <Row
            icon={Bell}
            label="Nhắc hoá đơn sắp tới"
            right={<Toggle on={prefs.notifBills} onChange={(v) => update({ notifBills: v })} />}
          />
          <Row
            icon={Bell}
            label="Cảnh báo vượt ngân sách"
            right={<Toggle on={prefs.notifBudget} onChange={(v) => update({ notifBudget: v })} />}
          />
          <Row
            icon={Bell}
            label="Tóm tắt hàng tuần"
            right={<Toggle on={prefs.notifWeekly} onChange={(v) => update({ notifWeekly: v })} />}
          />
          <Row icon={Bell} label="Trung tâm thông báo" onClick={() => navigate({ to: "/notifications" })} />
        </Section>

        {/* Bảo mật */}
        <Section title="Bảo mật & Riêng tư">
          <Row
            icon={Fingerprint}
            label="Khóa ứng dụng (Face ID / PIN)"
            right={<Toggle on={prefs.biometric} onChange={(v) => update({ biometric: v })} />}
          />
          <Row icon={ShieldCheck} label="Quyền & Riêng tư" onClick={() => navigate({ to: "/onboarding-privacy" })} />
          <Row icon={Download} label="Xuất dữ liệu" onClick={() => toast("Bắt đầu chuẩn bị bản xuất…")} />
        </Section>

        {/* Về Picket */}
        <Section title="Về Picket">
          <Row icon={HelpCircle} label="Trợ giúp & Hỗ trợ" onClick={() => toast("Sắp có trang trợ giúp")} />
          <Row icon={Star} label="Đánh giá Picket" onClick={() => toast("Cảm ơn bạn ❤")} />
          <Row icon={FileText} label="Điều khoản & Chính sách" onClick={() => navigate({ to: "/onboarding-privacy" })} />
          <Row icon={FileText} label="Phiên bản" value="1.0.0" />
        </Section>

        {/* Data & Setup */}
        <div className="mt-8">
          <Section title="Dữ liệu & Cấu hình">
            <Row
              icon={Wallet}
              label="Tài khoản & Ví"
              onClick={() => navigate({ to: "/wallets" })}
            />
            <Row
              icon={Tag}
              label="Danh mục & Nhãn"
              onClick={() => navigate({ to: "/categories" })}
            />
          </Section>
        </div>

        {/* Tài khoản */}
        <div className="mt-8">
          {signedIn && (
            <Section title="Tài khoản">
              <Row icon={LogOut} label="Đăng xuất" onClick={handleSignOut} />
              <Row
                icon={Trash2}
                danger
                label="Xoá tài khoản"
                onClick={() => toast.error("Liên hệ hỗ trợ để xoá tài khoản")}
              />
            </Section>
          )}
        </div>

        <p className="mt-6 text-center font-sans text-[10.5px] font-semibold uppercase tracking-[0.2em] text-foreground/35">
          Picket · Made with ♥
        </p>
      </div>

    </PhoneFrame>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ArrowRight, Shield, Gift } from "lucide-react";
import { PhoneFrame } from "@/components/phone-frame";
import { PopIn, FadeInUp } from "@/components/ui/animations";
import { getPricingPlans, getTrialDays, formatVND } from "@/data";
import type { PlanTier } from "@/data/pricing";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { vibrateLight, vibrateMedium } from "@/lib/haptic";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Chọn gói · Picket" },
      { name: "description", content: "Chọn gói sử dụng Picket phù hợp với bạn. Dùng thử miễn phí 14 ngày." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const navigate = useNavigate();
  const plans = getPricingPlans();
  const trialDays = getTrialDays();
  const [selected, setSelected] = useState<PlanTier>("plus");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const selectedPlan = plans.find((p) => p.id === selected)!;

  const getPrice = (plan: typeof selectedPlan) => {
    if (plan.monthlyPrice === 0) return "Miễn phí";
    if (billing === "yearly" && plan.yearlyPrice) {
      return formatVND(plan.yearlyPrice) + "/năm";
    }
    return formatVND(plan.monthlyPrice) + "/tháng";
  };

  const getSavings = (plan: typeof selectedPlan) => {
    if (!plan.yearlyPrice || plan.monthlyPrice === 0) return null;
    const monthlyCost = plan.monthlyPrice * 12;
    const saved = monthlyCost - plan.yearlyPrice;
    return saved > 0 ? saved : null;
  };

  const handleSubscribe = () => {
    vibrateMedium();
    if (selected === "free") {
      toast.success("Đã kích hoạt gói Free!");
      navigate({ to: "/" });
    } else {
      navigate({ 
        to: "/checkout", 
        search: { plan: selected as "plus" | "pro", billing } 
      });
    }
  };

  return (
    <PhoneFrame title="Chọn gói" subtitle="Nâng cấp trải nghiệm">
      <div className="space-y-5 px-5 pb-8">

        {/* Trial banner */}
        <FadeInUp>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#B5828C] to-[#FFB4A2] p-4 text-white shadow-lg shadow-[#B5828C]/20">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/15 blur-2xl" />
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <Gift className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-[13px] font-bold">Dùng thử miễn phí {trialDays} ngày</p>
                <p className="mt-0.5 text-[11px] font-medium opacity-80">
                  Trải nghiệm đầy đủ tính năng, huỷ bất cứ lúc nào.
                </p>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Billing toggle */}
        <FadeInUp delay={0.05}>
          <div className="flex gap-1 rounded-2xl bg-white/50 p-1.5 shadow-sm backdrop-blur-md">
            <button
              onClick={() => { vibrateLight(); setBilling("monthly"); }}
              className={`flex-1 rounded-xl py-2.5 text-center text-[13px] font-medium transition-all ${
                billing === "monthly"
                  ? "bg-white text-foreground font-semibold shadow-sm"
                  : "text-foreground/50 active:bg-white/40"
              }`}
            >
              Hàng tháng
            </button>
            <button
              onClick={() => { vibrateLight(); setBilling("yearly"); }}
              className={`flex-1 rounded-xl py-2.5 text-center text-[13px] font-medium transition-all ${
                billing === "yearly"
                  ? "bg-white text-foreground font-semibold shadow-sm"
                  : "text-foreground/50 active:bg-white/40"
              }`}
            >
              Hàng năm
              <span className="ml-1.5 rounded-lg bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                -17%
              </span>
            </button>
          </div>
        </FadeInUp>

        {/* Plan cards */}
        <div className="space-y-3">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            const isSelected = selected === plan.id;
            const savings = billing === "yearly" ? getSavings(plan) : null;

            return (
              <FadeInUp key={plan.id} delay={0.08 + i * 0.06}>
                <button
                  onClick={() => { vibrateLight(); setSelected(plan.id); }}
                  className={`relative w-full rounded-3xl border-2 p-5 text-left transition-all active:scale-[0.97] ${
                    isSelected
                      ? "border-foreground bg-white shadow-lg shadow-foreground/10"
                      : "border-transparent bg-white/70 shadow-sm"
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <span
                      className="absolute -top-3 right-4 rounded-xl px-3 py-1 text-[10px] font-bold text-white shadow-md"
                      style={{ backgroundColor: plan.accent }}
                    >
                      {plan.badge}
                    </span>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: plan.bg, color: plan.accent }}
                    >
                      <Icon className="h-6 w-6" strokeWidth={2.2} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-[18px] font-bold text-foreground">
                          {plan.name}
                        </h3>
                      </div>

                      <p className="mt-1 font-display text-[22px] font-bold tracking-tight text-foreground">
                        {getPrice(plan)}
                      </p>

                      {savings && billing === "yearly" && (
                        <p className="mt-0.5 text-[11px] font-semibold text-emerald-600">
                          Tiết kiệm {formatVND(savings)}/năm
                        </p>
                      )}

                      <p className="mt-2 text-[12px] font-medium leading-relaxed text-foreground/55">
                        {plan.description}
                      </p>
                    </div>

                    {/* Radio */}
                    <div
                      className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        isSelected
                          ? "border-foreground bg-foreground"
                          : "border-foreground/15"
                      }`}
                    >
                      {isSelected && <div className="h-2 w-2 rounded-full bg-background" />}
                    </div>
                  </div>
                </button>
              </FadeInUp>
            );
          })}
        </div>

        {/* Feature comparison — selected plan */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-md"
          >
            <h3 className="mb-4 text-[13px] font-bold uppercase tracking-wider text-foreground/50">
              Tính năng {selectedPlan.name}
            </h3>
            <ul className="space-y-3">
              {selectedPlan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: selectedPlan.bg, color: selectedPlan.accent }}
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </div>
                  <span className="text-[13px] font-medium text-foreground/80">{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

        {/* Security note */}
        <FadeInUp delay={0.2}>
          <div className="flex items-center gap-2.5 rounded-2xl bg-white/50 px-4 py-3 backdrop-blur-sm">
            <Shield className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.2} />
            <p className="text-[11px] font-medium text-foreground/50">
              Thanh toán bảo mật qua Stripe. Huỷ bất cứ lúc nào, không phát sinh phí ẩn.
            </p>
          </div>
        </FadeInUp>

        {/* CTA Button */}
        <FadeInUp delay={0.25}>
          <button
            onClick={handleSubscribe}
            className="flex w-full items-center justify-between rounded-2xl bg-foreground p-4 font-sans text-[15px] font-bold text-background shadow-xl shadow-foreground/20 transition active:scale-[0.97]"
          >
            <span>
              {selected === "free"
                ? "Bắt đầu miễn phí"
                : `Dùng thử ${selectedPlan.name} — ${trialDays} ngày miễn phí`}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/10">
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>
        </FadeInUp>

      </div>
    </PhoneFrame>
  );
}

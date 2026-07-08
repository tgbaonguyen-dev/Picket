import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { PhoneFrame } from "@/components/phone-frame";
import { FadeInUp } from "@/components/ui/animations";
import { ArrowLeft, CreditCard, Lock, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { getPricingPlans, formatVND } from "@/data";
import { toast } from "sonner";
import { vibrateLight, vibrateMedium, vibrateSuccess } from "@/lib/haptic";

// We need an Apple icon. Lucide doesn't have a perfect Apple logo by default, but we can use an SVG or a generic icon.
// Let's create a simple Apple SVG component for the Apple Pay button.
const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    {...props}
  >
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.757,3.951-5.445,3.951c-3.134,0-5.674-2.539-5.674-5.674 c0-3.134,2.54-5.673,5.674-5.673c1.474,0,2.81,0.56,3.83,1.475l2.846-2.845c-1.776-1.554-4.103-2.518-6.676-2.518 c-5.514,0-9.982,4.469-9.982,9.982c0,5.514,4.468,9.982,9.982,9.982c5.513,0,9.981-4.468,9.981-9.982 c0-0.892-0.128-1.748-0.347-2.539H12.545z" />
  </svg>
);

const checkoutSearchSchema = z.object({
  plan: z.enum(["plus", "pro"]).catch("plus"),
  billing: z.enum(["monthly", "yearly"]).catch("monthly"),
});

export const Route = createFileRoute("/checkout")({
  validateSearch: checkoutSearchSchema,
  component: CheckoutPage,
});

function CheckoutPage() {
  const { plan, billing } = Route.useSearch();
  const navigate = useNavigate();
  const plans = getPricingPlans();
  const selectedPlan = plans.find((p) => p.id === plan) || plans[1]; // fallback to plus
  
  const price = billing === "yearly" && selectedPlan.yearlyPrice 
    ? selectedPlan.yearlyPrice 
    : selectedPlan.monthlyPrice;
    
  const [method, setMethod] = useState<"card" | "applepay" | "googlepay">("applepay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form states
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");

  const handlePay = () => {
    vibrateMedium();
    setIsProcessing(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      vibrateSuccess();
      toast.success("Thanh toán thành công!", {
        description: `Chào mừng bạn đến với Picket ${selectedPlan.name}.`,
      });
      
      // Navigate to home after success
      setTimeout(() => {
        navigate({ to: "/" });
      }, 2000);
    }, 1500);
  };

  const formatCardNumber = (val: string) => {
    const v = val.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return val;
    }
  };

  const formatExpiry = (val: string) => {
    const v = val.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  if (isSuccess) {
    return (
      <PhoneFrame title="Thanh toán" hideBottomNav>
        <div className="flex h-full flex-col items-center justify-center px-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6 animate-in zoom-in duration-500">
            <CheckCircle2 className="h-10 w-10" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-bold font-display text-foreground text-center animate-in slide-in-from-bottom-2 duration-500">
            Thanh toán thành công!
          </h2>
          <p className="text-center text-[14px] font-medium text-foreground/60 mt-3 animate-in fade-in duration-700">
            Cảm ơn bạn đã nâng cấp lên {selectedPlan.name}. Bắt đầu trải nghiệm ngay.
          </p>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame 
      title="Thanh toán" 
      subtitle="Bảo mật 256-bit"
      hideBottomNav
      back={true}
    >
      <div className="px-5 pb-8 space-y-6 pt-2">
        
        {/* Order Summary */}
        <FadeInUp>
          <div className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-md ring-1 ring-black/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-foreground/50 uppercase tracking-widest">
                  Gói nâng cấp
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <h3 className="font-display text-[20px] font-bold text-foreground">
                    Picket {selectedPlan.name}
                  </h3>
                  <span className="rounded-md bg-foreground/5 px-2 py-0.5 text-[9px] font-bold text-foreground/70 uppercase tracking-wider">
                    {billing === "yearly" ? "HÀNG NĂM" : "HÀNG THÁNG"}
                  </span>
                </div>
              </div>
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                style={{ backgroundColor: selectedPlan.bg, color: selectedPlan.accent }}
              >
                <selectedPlan.icon className="h-6 w-6" strokeWidth={2.2} />
              </div>
            </div>
            
            <div className="my-5 h-px w-full bg-foreground/5" />
            
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-foreground/70">Tổng cộng</span>
              <span className="font-display text-[24px] font-bold text-foreground">
                {formatVND(price)}
              </span>
            </div>
          </div>
        </FadeInUp>

        {/* Payment Methods */}
        <FadeInUp delay={0.1}>
          <h3 className="mb-3 px-1 text-[12px] font-bold uppercase tracking-wider text-foreground/50">
            Phương thức thanh toán
          </h3>
          <div className="space-y-3">
            {/* Apple Pay / Google Pay */}
            <button
              onClick={() => { vibrateLight(); setMethod("applepay"); }}
              className={`relative flex w-full items-center gap-4 rounded-3xl border-[2.5px] p-4 transition-all ${
                method === "applepay"
                  ? "border-foreground bg-white shadow-md shadow-foreground/5"
                  : "border-transparent bg-white/50 shadow-sm"
              }`}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                method === "applepay" ? "bg-foreground text-background" : "bg-foreground/5 text-foreground/60"
              }`}>
                <AppleIcon className="h-6 w-6 fill-current" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-[15px] text-foreground">Apple Pay</p>
                <p className="text-[12px] font-medium text-foreground/50">Thanh toán một chạm</p>
              </div>
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  method === "applepay" ? "border-foreground bg-foreground" : "border-foreground/15"
                }`}
              >
                {method === "applepay" && <div className="h-1.5 w-1.5 rounded-full bg-background" />}
              </div>
            </button>

            {/* Google Pay */}
            <button
              onClick={() => { vibrateLight(); setMethod("googlepay"); }}
              className={`relative flex w-full items-center gap-4 rounded-3xl border-[2.5px] p-4 transition-all ${
                method === "googlepay"
                  ? "border-foreground bg-white shadow-md shadow-foreground/5"
                  : "border-transparent bg-white/50 shadow-sm"
              }`}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                method === "googlepay" ? "bg-foreground text-background" : "bg-foreground/5 text-foreground/60"
              }`}>
                <GoogleIcon className="h-6 w-6" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-[15px] text-foreground">Google Pay</p>
                <p className="text-[12px] font-medium text-foreground/50">Thanh toán một chạm</p>
              </div>
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  method === "googlepay" ? "border-foreground bg-foreground" : "border-foreground/15"
                }`}
              >
                {method === "googlepay" && <div className="h-1.5 w-1.5 rounded-full bg-background" />}
              </div>
            </button>

            {/* Credit Card (Wrapped to fix layout gap) */}
            <div className="flex flex-col">
              <button
              onClick={() => { vibrateLight(); setMethod("card"); }}
              className={`relative flex w-full items-center gap-4 rounded-3xl border-[2.5px] p-4 transition-all ${
                method === "card"
                  ? "border-foreground bg-white shadow-md shadow-foreground/5 rounded-b-none border-b-0 pb-3"
                  : "border-transparent bg-white/50 shadow-sm"
              }`}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                method === "card" ? "bg-foreground text-background" : "bg-foreground/5 text-foreground/60"
              }`}>
                <CreditCard className="h-6 w-6" strokeWidth={2} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-[15px] text-foreground">Thẻ tín dụng</p>
                <p className="text-[12px] font-medium text-foreground/50">Visa, Mastercard, JCB</p>
              </div>
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  method === "card" ? "border-foreground bg-foreground" : "border-foreground/15"
                }`}
              >
                {method === "card" && <div className="h-1.5 w-1.5 rounded-full bg-background" />}
              </div>
            </button>
            
            {/* Expanded Card Form */}
            {method === "card" && (
              <div className="rounded-3xl rounded-t-none border-[2.5px] border-t-0 border-foreground bg-white p-5 pt-0 shadow-md shadow-foreground/5 animate-in slide-in-from-top-2">
                <div className="space-y-4 pt-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-foreground/50 ml-1 tracking-wider">Số thẻ</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" strokeWidth={2} />
                      <input
                        type="tel"
                        maxLength={19}
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        className="w-full rounded-2xl border-none bg-foreground/5 py-3.5 pl-10 pr-4 text-[15px] font-bold text-foreground placeholder:text-foreground/30 focus:bg-foreground/10 focus:outline-none focus:ring-0 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-foreground/50 ml-1 tracking-wider">Hết hạn</label>
                      <input
                        type="tel"
                        maxLength={5}
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        className="w-full rounded-2xl border-none bg-foreground/5 px-4 py-3.5 text-[15px] font-bold text-foreground placeholder:text-foreground/30 focus:bg-foreground/10 focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-foreground/50 ml-1 tracking-wider">CVC</label>
                      <input
                        type="tel"
                        maxLength={4}
                        placeholder="123"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full rounded-2xl border-none bg-foreground/5 px-4 py-3.5 text-[15px] font-bold text-foreground placeholder:text-foreground/30 focus:bg-foreground/10 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-foreground/50 ml-1 tracking-wider">Tên trên thẻ</label>
                    <input
                      type="text"
                      placeholder="NGUYEN VAN A"
                      value={name}
                      onChange={(e) => setName(e.target.value.toUpperCase())}
                      className="w-full rounded-2xl border-none bg-foreground/5 px-4 py-3.5 text-[15px] font-bold text-foreground placeholder:text-foreground/30 focus:bg-foreground/10 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </FadeInUp>

        {/* Security Trust Badge */}
        <FadeInUp delay={0.2}>
          <div className="flex items-center justify-center gap-2 mt-6">
            <ShieldCheck className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
            <p className="text-[11px] font-semibold text-foreground/50">
              Được bảo vệ mã hoá đầu cuối an toàn bởi Stripe
            </p>
          </div>
        </FadeInUp>

        {/* Pay Button */}
        <FadeInUp delay={0.3}>
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="flex w-full items-center justify-center rounded-2xl bg-foreground py-4 font-sans text-[16px] font-bold text-background shadow-xl shadow-foreground/20 transition active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
          >
            {isProcessing ? (
              <Loader2 className="h-6 w-6 animate-spin text-background" />
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" strokeWidth={2.5} />
                <span>Thanh toán {formatVND(price)}</span>
              </div>
            )}
          </button>
        </FadeInUp>

      </div>
    </PhoneFrame>
  );
}

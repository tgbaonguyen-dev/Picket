import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { ACCOUNTS as INITIAL_ACCOUNTS, formatVND } from "@/data";
import { Banknote, CreditCard, Landmark, Plus, Wallet as WalletIcon, ChevronLeft } from "lucide-react";
import { Drawer } from "vaul";
import { vibrateLight } from "@/lib/haptic";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/wallets")({
  component: WalletsPage,
});

function getIconForType(type: string) {
  switch (type) {
    case "cash": return Banknote;
    case "bank": return Landmark;
    case "ewallet": return WalletIcon;
    case "credit": return CreditCard;
    default: return WalletIcon;
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case "cash": return "Tiền mặt";
    case "bank": return "Tài khoản Ngân hàng";
    case "ewallet": return "Ví điện tử";
    case "credit": return "Thẻ tín dụng";
    default: return "Khác";
  }
}

function getColor(type: string) {
  switch (type) {
    case "cash": return "bg-emerald-100 text-emerald-700";
    case "bank": return "bg-red-100 text-red-700";
    case "ewallet": return "bg-pink-100 text-pink-700";
    case "credit": return "bg-blue-100 text-blue-700";
    default: return "bg-foreground/10 text-foreground";
  }
}

function WalletsPage() {
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [newAccType, setNewAccType] = useState<string>("");
  const [newAccName, setNewAccName] = useState("");
  const [newAccBalance, setNewAccBalance] = useState("");

  const totalAssets = accounts.filter(a => a.balance > 0).reduce((s, a) => s + a.balance, 0);
  const totalDebts = accounts.filter(a => a.balance < 0).reduce((s, a) => s + a.balance, 0);
  const netWorth = totalAssets + totalDebts;

  // Group accounts by type
  const grouped = accounts.reduce((acc, account) => {
    if (!acc[account.type]) acc[account.type] = [];
    acc[account.type].push(account);
    return acc;
  }, {} as Record<string, typeof accounts>);

  // Define order of groups
  const order = ["cash", "bank", "ewallet", "credit"];

  const handleAddAccount = () => {
    if (!newAccName.trim()) {
      toast.error("Vui lòng nhập tên tài khoản");
      return;
    }
    const balance = Number(newAccBalance.replace(/\D/g, "")) || 0;
    const finalBalance = newAccType === "credit" ? -Math.abs(balance) : Math.abs(balance);
    
    setAccounts(prev => [...prev, {
      id: Math.random().toString(),
      name: newAccName,
      balance: finalBalance,
      type: newAccType
    }]);
    
    toast.success("Đã thêm ví mới");
    setIsDrawerOpen(false);
    
    // Reset form
    setTimeout(() => {
      setStep(1);
      setNewAccName("");
      setNewAccBalance("");
    }, 300);
  };

  return (
    <PhoneFrame title="Ví của bạn" back>
      <div className="flex h-full flex-col">
        {/* Net Worth Header */}
        <div className="mx-5 mb-6 mt-2 rounded-3xl bg-gradient-to-br from-foreground to-foreground/85 p-6 text-background shadow-lg relative overflow-hidden">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white opacity-10 blur-2xl" />
          <p className="text-[12px] font-medium uppercase tracking-widest opacity-70">Tổng tài sản ròng</p>
          <p className="mt-2 font-display text-[34px] font-bold leading-none tabular-nums tracking-tight">
            {formatVND(netWorth)}
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider opacity-60">Tài sản</p>
              <p className="font-display text-[14px] font-bold text-emerald-400">{formatVND(totalAssets)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider opacity-60">Nợ tín dụng</p>
              <p className="font-display text-[14px] font-bold text-rose-400">{formatVND(Math.abs(totalDebts))}</p>
            </div>
          </div>
        </div>

        {/* Wallets List */}
        <div className="flex-1 overflow-y-auto px-5 pb-32">
          {order.map((type) => {
            const items = grouped[type];
            if (!items || items.length === 0) return null;
            return (
              <section key={type} className="mb-6">
                <header className="mb-3 px-1">
                  <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.15em] text-foreground/50">
                    {getTypeLabel(type)}
                  </h2>
                </header>
                <div className="space-y-3">
                  {items.map((account) => {
                    const Icon = getIconForType(account.type);
                    const isDebt = account.balance < 0;
                    return (
                      <div
                        key={account.id}
                        className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition active:scale-[0.98]"
                      >
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] ${getColor(account.type)}`}>
                          <Icon className="h-6 w-6" strokeWidth={2} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-[15px] font-bold text-foreground">
                            {account.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-display text-[15px] font-bold tabular-nums ${isDebt ? "text-rose-600" : "text-foreground"}`}>
                            {isDebt ? "−" : ""}{formatVND(Math.abs(account.balance))}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Add Wallet FAB */}
        <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <Drawer.Trigger asChild>
            <button
              onClick={() => {
                vibrateLight();
                setStep(1);
              }}
              className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-xl active:scale-95 transition-transform"
            >
              <Plus className="h-6 w-6" strokeWidth={2.5} />
            </button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm" />
            <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[101] mt-24 flex max-h-[85vh] flex-col rounded-t-[36px] bg-[#FFF8F0] shadow-[0_-20px_40px_-10px_rgba(0,0,0,0.4)] sm:mx-auto sm:max-w-[390px]">
              <div className="flex-1 overflow-y-auto rounded-t-[36px] bg-[#FFF8F0] px-5 pb-8 pt-3">
                <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-foreground/15" />
                
                {step === 1 ? (
                  <>
                    <h2 className="mb-2 font-display text-[22px] font-bold text-foreground">Thêm Ví mới</h2>
                    <p className="mb-6 font-sans text-[13px] text-foreground/60">
                      Chọn loại tài khoản bạn muốn thêm để theo dõi số dư.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {order.map(type => {
                        const Icon = getIconForType(type);
                        return (
                          <button 
                            key={type} 
                            onClick={() => {
                              vibrateLight();
                              setNewAccType(type);
                              setStep(2);
                            }}
                            className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-5 shadow-sm active:scale-95 border border-transparent hover:border-foreground/10"
                          >
                            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getColor(type)}`}>
                              <Icon className="h-6 w-6" strokeWidth={2} />
                            </div>
                            <span className="font-sans text-[12px] font-semibold text-foreground/80">{getTypeLabel(type)}</span>
                          </button>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <button 
                        onClick={() => setStep(1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/5 text-foreground/60 active:scale-95"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <h2 className="font-display text-[20px] font-bold text-foreground">Chi tiết tài khoản</h2>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Tên tài khoản */}
                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-foreground/40">Tên tài khoản / Ví</label>
                        <input 
                          type="text" 
                          value={newAccName}
                          onChange={(e) => setNewAccName(e.target.value)}
                          placeholder={
                            newAccType === "bank" ? "Vd: Vietcombank, TPBank..." : 
                            newAccType === "ewallet" ? "Vd: MoMo, ZaloPay..." : 
                            newAccType === "credit" ? "Vd: Thẻ tín dụng VIB..." : 
                            "Vd: Tiền mặt, Lợn đất..."
                          }
                          className="w-full bg-transparent outline-none mt-1 font-display text-[16px] font-semibold text-foreground placeholder:text-foreground/20"
                          autoFocus
                        />
                      </div>

                      {/* Số dư */}
                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-foreground/40">
                          {newAccType === "credit" ? "Dư nợ hiện tại" : "Số dư ban đầu"}
                        </label>
                        <div className="flex items-center mt-1">
                          <span className="font-display text-[16px] font-semibold text-foreground mr-1">₫</span>
                          <input 
                            type="text" 
                            inputMode="numeric"
                            value={newAccBalance}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              setNewAccBalance(val ? parseInt(val).toLocaleString("vi-VN") : "");
                            }}
                            placeholder="0"
                            className="w-full bg-transparent outline-none font-display text-[16px] font-semibold text-foreground placeholder:text-foreground/20"
                          />
                        </div>
                      </div>

                      <button 
                        onClick={handleAddAccount}
                        className="mt-4 w-full rounded-2xl bg-foreground py-4 font-sans text-[14px] font-bold text-background transition active:scale-[0.98]"
                      >
                        Lưu tài khoản
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </PhoneFrame>
  );
}

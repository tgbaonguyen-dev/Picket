import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ChevronLeft, MoreHorizontal, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { vibrateLight } from '@/lib/haptic';
import { useState, useEffect } from 'react';
import { findAccount, getAccountTransactions, getAccounts, formatVND } from '@/data';

export const Route = createFileRoute('/accounts/$id')({
  component: AccountDetailsPage,
});

function AccountDetailsPage() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const account = findAccount(id) ?? getAccounts()[0];
  const transactions = getAccountTransactions(account.id);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const handleBack = () => {
    vibrateLight();
    navigate({ to: '/wallets' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-page">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-page/80 px-5 pt-[max(env(safe-area-inset-top),24px)] pb-4 backdrop-blur-xl">
        <button 
          onClick={handleBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5 text-foreground/80 active:scale-95 transition"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <span className="font-display text-[17px] font-bold text-foreground">Chi tiết ví</span>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5 text-foreground/80 active:scale-95 transition">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </header>

      {/* Account Info */}
      <div className="px-5 pt-4">
        <div className="rounded-[32px] bg-foreground p-6 text-background shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-[22px] font-bold">{account.name}</h2>
              <p className="font-sans text-[13px] text-background/60 mt-1">*{(account.number ?? "0000").slice(-4)}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background/10 backdrop-blur-md">
              <Activity className="h-6 w-6 text-background" />
            </div>
          </div>
          <div>
            <p className="text-[12px] uppercase tracking-widest text-background/60 font-bold mb-1">Số dư khả dụng</p>
            <p className="font-display text-[32px] font-bold tracking-tight">
              {formatVND(account.balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mt-6 grid grid-cols-2 gap-4">
        <button className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-4 shadow-sm active:scale-95 transition">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <ArrowDownRight className="h-5 w-5" />
          </div>
          <span className="font-sans text-[13px] font-bold text-foreground">Thu tiền</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-4 shadow-sm active:scale-95 transition">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <ArrowUpRight className="h-5 w-5" />
          </div>
          <span className="font-sans text-[13px] font-bold text-foreground">Chi tiêu</span>
        </button>
      </div>

      {/* Transactions List */}
      <div className="mt-8 flex-1 rounded-t-[32px] bg-white px-5 pt-8 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)] pb-[max(env(safe-area-inset-bottom),24px)]">
        <h3 className="font-display text-[18px] font-bold text-foreground mb-6">Lịch sử giao dịch</h3>
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4 animate-in fade-in duration-500">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4 border-b border-foreground/5 pb-4 last:border-0 last:pb-0">
                  <div className="h-12 w-12 shrink-0 rounded-[18px] bg-foreground/5 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 rounded-full bg-foreground/10 animate-pulse" />
                    <div className="h-3 w-20 rounded-full bg-foreground/5 animate-pulse" />
                  </div>
                  <div className="h-4 w-20 rounded-full bg-foreground/10 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {transactions.map(tx => {
                const isExpense = tx.type === 'expense';
                return (
                  <div key={tx.id} className="flex items-center gap-4 border-b border-foreground/5 pb-4 last:border-0 last:pb-0">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] ${
                      isExpense ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {isExpense ? <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} /> : <ArrowDownRight className="h-5 w-5" strokeWidth={2.5} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-[15px] font-bold text-foreground truncate">{tx.name}</p>
                      <p className="font-sans text-[12px] text-foreground/50 mt-0.5">{tx.date} • {tx.category}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-display text-[15px] font-bold tabular-nums ${isExpense ? 'text-foreground' : 'text-emerald-600'}`}>
                        {isExpense ? '-' : '+'}{formatVND(Math.abs(tx.amount))}
                      </p>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Target, ArrowRight, Wallet, Archive, Map, Users, LayoutGrid } from 'lucide-react';
import { vibrateLight } from '@/lib/haptic';

import { getGoalOptions } from "@/data";
import { FadeInUp } from "@/components/ui/animations";

export const Route = createFileRoute('/onboarding-goals')({
  component: OnboardingGoalsPage,
});

function OnboardingGoalsPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleGoal = (id: string) => {
    vibrateLight;
    setSelected(prev => {
      if (id === 'all') return prev.includes('all') ? [] : ['all'];
      const next = prev.filter(i => i !== 'all');
      return next.includes(id) ? next.filter(i => i !== id) : [...next, id];
    });
  };

  const onNext = () => {
    vibrateLight;
    navigate({ to: '/onboarding-persona' });
  };

  return (
    <FadeInUp className="h-full flex flex-col w-full flex-1">
    <div className="flex min-h-screen flex-col bg-page">
      <div className="flex-1 px-6 pt-[max(env(safe-area-inset-top),32px)]">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-foreground/5">
          <Target className="h-6 w-6 text-primary" strokeWidth={2.5} />
        </div>
        
        <h1 className="font-display text-[28px] font-bold text-foreground leading-tight">
          Mục tiêu của bạn<br />khi dùng Picket?
        </h1>
        <p className="mt-3 font-sans text-[15px] text-foreground/60 leading-relaxed">
          Giúp chúng tôi tối ưu hoá trải nghiệm và các tính năng phù hợp nhất với bạn.
        </p>

        <div className="mt-8 space-y-3">
          {getGoalOptions().map(goal => {
            const isSelected = selected.includes(goal.id);
            const Icon = goal.icon;
            
            return (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`flex w-full items-center gap-4 rounded-[20px] border-2 p-4 text-left transition active:scale-[0.97] ${
                  isSelected 
                    ? 'border-foreground bg-white shadow-md' 
                    : 'border-transparent bg-white shadow-sm border-foreground/5'
                }`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${goal.bg} ${goal.color}`}>
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <span className={`font-sans text-[15px] font-bold ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}>
                    {goal.label}
                  </span>
                </div>
                <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                  isSelected ? 'border-foreground bg-foreground' : 'border-foreground/15'
                }`}>
                  {isSelected && <div className="h-2 w-2 rounded-full bg-background" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 pb-[max(env(safe-area-inset-bottom),24px)] bg-page">
        <button
          onClick={onNext}
          disabled={selected.length === 0}
          className="flex w-full items-center justify-between rounded-2xl bg-foreground p-4 font-sans text-[15px] font-bold text-background transition active:scale-[0.97] disabled:opacity-30"
        >
          <span>Tiếp tục</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/10">
            <ArrowRight className="h-4 w-4" />
          </div>
        </button>
      </div>
    </div>
    </FadeInUp>
  );
}

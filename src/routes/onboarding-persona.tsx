import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { User, ArrowRight, GraduationCap, Briefcase, Home, Coffee, Store } from 'lucide-react';
import { vibrateLight } from '@/lib/haptic';

import { getPersonaOptions } from "@/data";

export const Route = createFileRoute('/onboarding-persona')({
  component: OnboardingPersonaPage,
});

function OnboardingPersonaPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const selectPersona = (id: string) => {
    vibrateLight;
    setSelected(id);
  };

  const onNext = () => {
    vibrateLight;
    navigate({ to: '/onboarding-ready' }); // Or wherever next is
  };

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <div className="flex-1 px-6 pt-[max(env(safe-area-inset-top),32px)]">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-foreground/5">
          <User className="h-6 w-6 text-primary" strokeWidth={2.5} />
        </div>
        
        <h1 className="font-display text-[28px] font-bold text-foreground leading-tight">
          Bạn mô tả bản thân<br />như thế nào?
        </h1>
        <p className="mt-3 font-sans text-[15px] text-foreground/60 leading-relaxed">
          Picket sẽ gợi ý các danh mục và mẫu ngân sách phù hợp nhất với bạn.
        </p>

        <div className="mt-8 space-y-3">
          {getPersonaOptions().map(persona => {
            const isSelected = selected === persona.id;
            const Icon = persona.icon;
            
            return (
              <button
                key={persona.id}
                onClick={() => selectPersona(persona.id)}
                className={`flex w-full items-center gap-4 rounded-[20px] border-2 p-4 text-left transition active:scale-[0.98] ${
                  isSelected 
                    ? 'border-foreground bg-white shadow-md' 
                    : 'border-transparent bg-white shadow-sm border-foreground/5'
                }`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${persona.bg} ${persona.color}`}>
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className={`font-sans text-[15px] font-bold ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}>
                    {persona.label}
                  </p>
                  <p className="font-sans text-[12px] text-foreground/50 mt-0.5">
                    {persona.desc}
                  </p>
                </div>
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
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
          disabled={!selected}
          className="flex w-full items-center justify-between rounded-2xl bg-foreground p-4 font-sans text-[15px] font-bold text-background transition active:scale-[0.98] disabled:opacity-30"
        >
          <span>Tiếp tục</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/10">
            <ArrowRight className="h-4 w-4" />
          </div>
        </button>
      </div>
    </div>
  );
}

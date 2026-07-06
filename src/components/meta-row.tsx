import React from "react";

interface MetaRowProps {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
}

export function MetaRow({ label, value, icon, children, onClick }: MetaRowProps) {
  return (
    <div 
      className={`flex items-center justify-between px-4 py-3 ${onClick ? "cursor-pointer active:bg-foreground/5 transition-colors" : ""}`}
      onClick={onClick}
    >
      <span className="text-[12px] text-foreground/55">{label}</span>
      
      {children ? (
        children
      ) : (
        <span className="flex items-center gap-1.5 text-right font-display text-[14px] font-semibold">
          {icon}
          {value}
        </span>
      )}
    </div>
  );
}

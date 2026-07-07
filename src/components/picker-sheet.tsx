import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Check } from "lucide-react";
import React from "react";

export function PickerSheet<T extends string>({
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
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Nếu vuốt xuống đủ nhanh hoặc đủ xa thì đóng
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-50 flex items-end" onClick={onClose}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px]" 
          />
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.8 }}
            onDragEnd={handleDragEnd}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="relative w-full rounded-t-[32px] bg-white p-5 pb-[max(env(safe-area-inset-bottom),24px)] shadow-2xl flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="mx-auto mb-4 h-1.5 w-12 shrink-0 cursor-grab rounded-full bg-foreground/15 active:cursor-grabbing" />
            
            <p className="mb-4 px-1 font-display text-[18px] font-bold text-foreground shrink-0">{title}</p>
            
            <ul className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden space-y-1.5 pb-2">
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
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left font-sans text-[14px] transition-all active:scale-[0.97] ${
                        selected 
                          ? "bg-[#FFE9D9] font-bold text-[#8F5F68]" 
                          : "font-semibold text-foreground/70 bg-transparent hover:bg-foreground/5"
                      }`}
                    >
                      <span className="min-w-0 flex-1 truncate">{render ? render(opt) : opt}</span>
                      {selected && <Check className="h-5 w-5 text-[#B5828C]" strokeWidth={2.6} />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

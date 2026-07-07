import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function GlobalLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/40 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="flex flex-col items-center gap-3"
      >
        <div className="relative flex h-16 w-16 items-center justify-center rounded-[24px] bg-white shadow-[0_10px_40px_-10px_rgba(181,130,140,0.4)]">
          <Loader2 className="h-8 w-8 animate-spin text-[#B5828C]" />
        </div>
        <p className="font-sans text-[13px] font-bold text-foreground/70 animate-pulse">
          Đợi một chút nhé...
        </p>
      </motion.div>
    </motion.div>
  );
}

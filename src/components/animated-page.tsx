import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function AnimatedPage({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`h-full w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}

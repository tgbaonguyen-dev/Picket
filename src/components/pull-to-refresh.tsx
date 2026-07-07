import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState, useRef, useEffect, ReactNode } from "react";
import { vibrateLight, vibrateMedium } from "@/lib/haptic";
import { SPRING_SOFT, SPRING_SETTLE } from "@/lib/motion";

export function PullToRefresh({
  children,
  onRefresh,
  scrollClassName = "",
}: {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  scrollClassName?: string;
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const y = useMotionValue(0);
  
  const MAX_PULL = 120;
  const THRESHOLD = 70;

  const startY = useRef(0);
  const isPulling = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (el.scrollTop <= 0) {
        startY.current = e.touches[0].clientY;
        isPulling.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current || isRefreshing) return;
      
      const touchY = e.touches[0].clientY;
      const dy = touchY - startY.current;

      if (dy > 0 && el.scrollTop <= 0) {
        if (e.cancelable) e.preventDefault();
        y.set(Math.min(dy * 0.4, MAX_PULL));
      } else {
        isPulling.current = false;
        y.set(0);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling.current) return;
      isPulling.current = false;

      if (y.get() > THRESHOLD && !isRefreshing) {
        setIsRefreshing(true);
        vibrateMedium();
        animate(y, 80, SPRING_SOFT);
        
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          vibrateLight();
          animate(y, 0, SPRING_SETTLE);
        }
      } else {
        animate(y, 0, SPRING_SETTLE);
      }
    };

    // For desktop mouse drag (preview)
    const handleMouseDown = (e: MouseEvent) => {
      if (el.scrollTop <= 0) {
        startY.current = e.clientY;
        isPulling.current = true;
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPulling.current || isRefreshing || e.buttons !== 1) {
        if (isPulling.current && e.buttons === 0) handleMouseUp();
        return;
      }
      const dy = e.clientY - startY.current;
      if (dy > 0 && el.scrollTop <= 0) {
        y.set(Math.min(dy * 0.4, MAX_PULL));
      } else {
        isPulling.current = false;
        y.set(0);
      }
    };
    
    const handleMouseUp = async () => {
      if (!isPulling.current) return;
      isPulling.current = false;

      if (y.get() > THRESHOLD && !isRefreshing) {
        setIsRefreshing(true);
        animate(y, 80, SPRING_SOFT);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          animate(y, 0, SPRING_SETTLE);
        }
      } else {
        animate(y, 0, SPRING_SETTLE);
      }
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    
    el.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isRefreshing, onRefresh, y]);

  // Spinner rotation logic based on pull distance
  const rotate = useTransform(y, [0, MAX_PULL], [0, 360]);
  const opacity = useTransform(y, [0, THRESHOLD], [0, 1]);
  const scale = useTransform(y, [0, THRESHOLD], [0.8, 1]);
  const indicatorY = useTransform(y, [0, MAX_PULL], [-60, 60]);
  const contentY = useTransform(y, [0, MAX_PULL], [0, MAX_PULL * 0.15]); // very subtle parallax

  return (
    <div className="relative flex-1 w-full overflow-hidden flex flex-col bg-transparent">
      {/* Floating Pill */}
      <motion.div
        className="absolute left-0 right-0 flex items-center justify-center z-50 pointer-events-none"
        style={{ top: "max(env(safe-area-inset-top), 20px)", y: indicatorY }}
      >
        <motion.div 
          style={{ rotate, opacity, scale }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-foreground/5"
        >
          <Loader2 className={`h-5 w-5 text-[#B5828C] ${isRefreshing ? "animate-spin" : ""}`} strokeWidth={2.5} />
        </motion.div>
      </motion.div>

      {/* Scrollable Content */}
      <motion.div
        ref={containerRef}
        className={`relative z-10 h-full w-full overflow-y-auto overscroll-y-none ${scrollClassName}`}
        style={{ y: contentY }}
      >
        {children}
      </motion.div>
    </div>
  );
}

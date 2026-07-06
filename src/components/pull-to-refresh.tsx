import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState, useRef, useEffect, ReactNode } from "react";
import { vibrateLight, vibrateMedium } from "@/lib/haptic";

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
  const controls = useAnimation();
  
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
        await controls.start({ y: 50, transition: { type: "spring", bounce: 0.2 } });
        
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          vibrateLight();
          controls.start({ y: 0, transition: { type: "spring", bounce: 0.4 } });
        }
      } else {
        controls.start({ y: 0, transition: { type: "spring", bounce: 0.4 } });
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
        await controls.start({ y: 50, transition: { type: "spring", bounce: 0.2 } });
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          controls.start({ y: 0, transition: { type: "spring", bounce: 0.4 } });
        }
      } else {
        controls.start({ y: 0, transition: { type: "spring", bounce: 0.4 } });
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
  }, [isRefreshing, onRefresh, controls, y]);

  // Spinner rotation logic based on pull distance
  const rotate = useTransform(y, [0, MAX_PULL], [0, 360]);
  const opacity = useTransform(y, [0, THRESHOLD], [0, 1]);

  return (
    <div className="relative flex-1 w-full overflow-hidden flex flex-col bg-transparent">
      {/* Background container for the spinner */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center z-0 pointer-events-none"
        style={{ height: y }}
      >
        <motion.div style={{ rotate, opacity }}>
          <Loader2 className={`h-6 w-6 text-foreground/50 ${isRefreshing ? "animate-spin" : ""}`} />
        </motion.div>
      </motion.div>

      {/* Scrollable Content */}
      <motion.div
        ref={containerRef}
        className={`relative z-10 h-full w-full overflow-y-auto overflow-x-hidden overscroll-none ${scrollClassName}`}
        style={{ y }}
        animate={controls}
      >
        {children}
      </motion.div>
    </div>
  );
}

import { motion, useAnimation, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { Trash2 } from "lucide-react";
import { vibrateHeavy } from "@/lib/haptic";
import { useState } from "react";
import { SPRING_SETTLE } from "@/lib/motion";

interface SwipeableItemProps {
  children: React.ReactNode;
  onDelete?: () => void;
  className?: string;
}

export function SwipeableItem({ children, onDelete, className = "" }: SwipeableItemProps) {
  const controls = useAnimation();
  const [isDeleting, setIsDeleting] = useState(false);
  const x = useMotionValue(0);
  const redWidth = useTransform(x, (v) => Math.max(0, -v));
  const redOpacity = useTransform(x, [0, -40], [0, 1]);

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Nếu vuốt sang trái quá 80px hoặc vuốt nhanh quá mức -400px/s
    if (offset < -80 || velocity < -400) {
      vibrateHeavy();
      setIsDeleting(true);
      await controls.start({ x: "-100%", opacity: 0, transition: { duration: 0.2 } });
      onDelete?.();
    } else {
      // Trả về vị trí cũ nếu chưa đủ lực
      controls.start({ x: 0, transition: SPRING_SETTLE });
    }
  };

  if (isDeleting) {
    return (
      <motion.div
        initial={{ height: "auto", opacity: 1, scale: 1 }}
        animate={{ height: 0, opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      />
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      {/* Background (Delete Action) - Dynamic width to prevent bleeding behind translucent row */}
      <motion.div 
        style={{ width: redWidth, opacity: redOpacity }}
        className="absolute right-0 top-0 bottom-0 flex items-center justify-end bg-[#dc2626] rounded-2xl overflow-hidden"
      >
        <div className="flex w-[100px] shrink-0 items-center justify-center">
          <Trash2 className="h-[22px] w-[22px] text-white" strokeWidth={2.5} />
        </div>
      </motion.div>

      {/* Foreground Draggable Item */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className="relative z-10 h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

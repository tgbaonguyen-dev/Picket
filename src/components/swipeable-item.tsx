import { motion, useAnimation, PanInfo } from "framer-motion";
import { Trash2 } from "lucide-react";
import { vibrateHeavy } from "@/lib/haptic";
import { useState } from "react";

interface SwipeableItemProps {
  children: React.ReactNode;
  onDelete?: () => void;
  className?: string;
}

export function SwipeableItem({ children, onDelete, className = "" }: SwipeableItemProps) {
  const controls = useAnimation();
  const [isDeleting, setIsDeleting] = useState(false);

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
      controls.start({ x: 0, transition: { type: "spring", stiffness: 400, damping: 25 } });
    }
  };

  if (isDeleting) {
    return (
      <motion.div
        initial={{ height: "auto", opacity: 1 }}
        animate={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      />
    );
  }

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Background (Delete Action) */}
      <div className="absolute inset-0 flex items-center justify-end bg-red-500 px-6">
        <Trash2 className="h-5 w-5 text-white" />
      </div>

      {/* Foreground Draggable Item */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="relative z-10 h-full w-full bg-[#fdfdfd]"
      >
        {children}
      </motion.div>
    </div>
  );
}

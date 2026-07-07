import { motion, HTMLMotionProps } from "framer-motion";
import React, { ElementType } from "react";
import { DUR, EASE_SILK, TAP_SCALE, T_FAST } from "@/lib/motion";

export function FadeInUp({
  children,
  delay = 0,
  duration = DUR.base,
  y = 8,
  className = "",
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; duration?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration, ease: EASE_SILK }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FadeInRight({
  children,
  delay = 0,
  duration = DUR.base,
  x = 8,
  className = "",
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; duration?: number; x?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration, ease: EASE_SILK }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FadeInLeft({
  children,
  delay = 0,
  duration = DUR.base,
  x = -8,
  className = "",
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; duration?: number; x?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration, ease: EASE_SILK }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function PopIn({
  children,
  delay = 0,
  duration = DUR.base,
  scale = 0.96,
  className = "",
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; duration?: number; scale?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration, ease: EASE_SILK }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Squish({
  children,
  scale = TAP_SCALE,
  className = "",
  as: Component = motion.div,
  ...props
}: any & { scale?: number; as?: ElementType }) {
  return (
    <Component
      whileTap={{ scale }}
      transition={T_FAST}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

import { motion, HTMLMotionProps } from "framer-motion";
import React, { ElementType } from "react";

export function FadeInUp({
  children,
  delay = 0,
  duration = 0.3,
  y = 10,
  className = "",
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; duration?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration }}
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
  duration = 0.3,
  x = 10,
  className = "",
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; duration?: number; x?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration }}
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
  duration = 0.3,
  x = -10,
  className = "",
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; duration?: number; x?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration }}
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
  duration = 0.3,
  scale = 0.95,
  className = "",
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; duration?: number; scale?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Squish({
  children,
  scale = 0.96,
  className = "",
  as: Component = motion.div,
  ...props
}: any & { scale?: number; as?: ElementType }) {
  return (
    <Component
      whileTap={{ scale }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

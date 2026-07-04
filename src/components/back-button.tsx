import { useRouter, useCanGoBack } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Shared back button — visually identical to the one in PhoneFrame so
 * every screen (framed or not) uses the same shape and interaction.
 * Uses real router history with a safe fallback route.
 */
export function BackButton({
  fallback = "/",
  className,
  icon,
  ariaLabel = "Quay lại",
}: {
  fallback?: string;
  className?: string;
  icon?: ReactNode;
  ariaLabel?: string;
}) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const onClick = () => {
    if (canGoBack) {
      router.history.back();
    } else {
      router.navigate({ to: fallback });
    }
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={
        className ??
        "flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 bg-white/80 text-foreground shadow-sm backdrop-blur-md transition active:scale-95"
      }
    >
      {icon ?? <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />}
    </button>
  );
}


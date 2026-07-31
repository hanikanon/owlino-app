import React from "react";
import { motion } from "framer-motion";

export const Toggle = React.memo(
  function Toggle({
    checked,
    onChange,
    label,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label?: string;
  }) {
    return (
      <button
        type="button"
        aria-label={label}
        onClick={(e) => {
          e.stopPropagation();
          onChange(!checked);
        }}
        className="relative inline-flex h-[26px] w-[44px] shrink-0 items-center rounded-full transition-colors cursor-pointer outline-none"
        style={{
          background: checked
            ? "var(--primary)"
            : "color-mix(in oklab, var(--foreground) 14%, transparent)",
          boxShadow: checked
            ? "0 6px 18px -6px color-mix(in oklab, var(--primary) 60%, transparent), inset 0 1px 0 color-mix(in oklab, white 18%, transparent)"
            : "inset 0 1px 0 color-mix(in oklab, white 4%, transparent)",
        }}
      >
        <motion.span
          transition={{ type: "spring", stiffness: 700, damping: 34 }}
          className="block h-[22px] w-[22px] rounded-full bg-white shadow-[0_2px_8px_rgb(0,0,0,0.15)] ring-1 ring-black/5"
          initial={false}
          animate={{ x: checked ? 20 : 2 }}
        />
      </button>
    );
  },
  (prev, next) => prev.checked === next.checked,
);

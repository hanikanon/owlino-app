import React from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export const SettingGroup = React.memo(function SettingGroup({
  label,
  children,
  delay = 0,
  footer,
}: {
  label?: string;
  children: ReactNode;
  delay?: number;
  footer?: string | ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="mb-6"
    >
      {label ? <h3 className="px-5 pb-2 text-[13.5px] font-medium text-primary">{label}</h3> : null}
      <div className="mx-3 overflow-hidden rounded-[20px] bg-surface">{children}</div>
      {footer ? (
        <p className="px-5 pt-2 text-[12.5px] leading-relaxed text-muted-foreground">{footer}</p>
      ) : null}
    </motion.section>
  );
});

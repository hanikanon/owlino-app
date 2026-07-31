import { AnimatePresence, motion, useScroll, useMotionValueEvent, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import type { ReactNode } from "react";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { useSettings } from "./SettingsContext";

export function SettingsScreen({
  title,
  children,
  right,
}: {
  title: string;
  children: ReactNode;
  right?: ReactNode;
}) {
  const s = useSettings();
  const speed = 0.24;
  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const goBack = () => {
    if (canGoBack) router.history.back();
    else router.navigate({ to: "/" });
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });
  
  const scrollYBounded = useMotionValue(0);
  const scrollYBoundedProgress = useTransform(scrollYBounded, [0, 80], [0, 1]);
  const headerY = useTransform(scrollYBoundedProgress, [0, 1], ["0%", "-100%"]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    const diff = latest - previous;
    const current = scrollYBounded.get();
    
    if (latest <= 0) {
      scrollYBounded.set(0);
    } else {
      scrollYBounded.set(Math.min(Math.max(current + diff, 0), 80));
    }
  });

  return (
    <div ref={scrollRef} className="h-full w-full overflow-y-auto overflow-x-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
    <div className="mx-auto flex min-h-[100.1%] w-full max-w-[520px] flex-col md:max-w-[560px]">
      <motion.header
        style={{ 
          y: headerY,
          paddingTop: "max(env(safe-area-inset-top), 12px)", 
          willChange: "transform" 
        }} className="glass sticky top-0 z-20 flex items-center gap-2 px-4 py-3"
      >
        <motion.button
          initial={false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          onClick={goBack} className="press flex h-9 w-9 items-center justify-center rounded-xl text-foreground hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)] press"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </motion.button>
        <motion.h1
          key={title}
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }} className="flex-1 truncate text-[17px] font-semibold tracking-tight text-foreground"
        >
          {title}
        </motion.h1>
        {right}
      </motion.header>
      <main className="flex-1 pb-16 pt-4">
        {children}
      </main>
    </div>
  </div>
  );
}

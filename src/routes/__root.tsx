import "../styles.css";

import { createRootRoute } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import React, { ReactNode } from "react";
import { SettingsProvider } from "../components/settings/SettingsContext";
import { motion, AnimatePresence } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import { useSettings } from "../components/settings/SettingsContext";
import { themeStyle } from "../config/themes";
import { useLayoutEffect, useEffect } from "react";
import { ScrollRestoration, Scripts, Outlet, HeadContent } from "@tanstack/react-router";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
        <h1 className="mb-2 text-2xl font-bold">404</h1>
        <p className="text-muted-foreground">The page you are looking for does not exist.</p>
      </div>
    );
  },
});

function RouteTransition({ children }: { children: ReactNode }) {
  const routerState = useRouterState();
  const isBack = !!(routerState.location.state as any)?.isBack;
  return (
    <AnimatePresence mode="popLayout" custom={isBack}>
      <motion.div
        key={routerState.location.pathname}
        custom={isBack}
        variants={{
          initial: (back: boolean) => ({
            x: back ? -20 : 20,
            opacity: 0,
          }),
          animate: {
            x: 0,
            opacity: 1,
          },
          exit: (back: boolean) => ({
            x: back ? 20 : -20,
            opacity: 0,
          })
        }}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 35,
          mass: 0.8,
        }}
        className="h-full w-full bg-background"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}


const IS_CAPACITOR_BUILD = import.meta.env.VITE_CAPACITOR_BUILD === "true";

function RootComponent() {
  const appBody = (
    <div id="app-root">
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <ThemedShell>
            <RouteTransition>
              <Outlet />
            </RouteTransition>
          </ThemedShell>
        </SettingsProvider>
      </QueryClientProvider>
    </div>
  );

  // Native (Capacitor) build: our own static index.capacitor.html already
  // provides <html>/<head>/<body>, so just render the app body here.
  if (IS_CAPACITOR_BUILD) {
    return <React.Fragment>{appBody}</React.Fragment>;
  }

  return (
    <React.Fragment>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
          <meta name="theme-color" content="#070E1F" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" href="/icons/icon-192.png" />
          <link rel="apple-touch-icon" href="/icons/icon-192.png" />
          <title>Cryptvora Settings</title>
          <HeadContent />
        </head>
        <body>
          {appBody}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </React.Fragment>
  );
}

function ThemedShell({ children }: { children: ReactNode }) {
  const s = useSettings();
  
  useIsomorphicLayoutEffect(() => {
    const l = document.getElementById('ssr-loader');
    if(l) { l.style.opacity = '0'; setTimeout(() => l.remove(), 300); }
  }, []);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.3 }}
      className="flex h-screen w-full items-center justify-center overflow-hidden bg-background font-sans text-foreground" 
      style={themeStyle(s.theme, s.accent, s.radius, s.fontSize, s.blur)}
    >
      <div className="relative mx-auto flex h-full w-full max-w-[480px] flex-col overflow-hidden bg-background shadow-2xl">
        {children}
        <Toaster 
          theme="dark" 
          position="bottom-center"
          toastOptions={{
            style: {
              background: 'var(--surface-3)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              borderRadius: '16px',
            }
          }}
        />
      </div>
    </motion.div>
  );
}

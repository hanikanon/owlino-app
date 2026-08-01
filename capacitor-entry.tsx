import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter, createHashHistory } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "./src/routeTree.gen";
import { SettingsSkeleton } from "./src/components/settings/SettingsSkeleton";
import "./src/styles.css";

// Native (Capacitor) build: build our own router with hash-based history.
// The WebView that serves the packaged app doesn't behave like a normal
// web server for path-based routing, so hash routing (#/settings/...)
// avoids any base-path / 404 mismatches entirely.
const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: { queryClient },
  history: createHashHistory(),
  scrollRestoration: true,
  defaultPreload: "intent",
  defaultPreloadDelay: 50,
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: SettingsSkeleton,
});

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element #root not found");
}

ReactDOM.createRoot(rootEl).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);


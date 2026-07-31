export function SettingsSkeleton() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-[520px] flex-col md:max-w-[560px] animate-pulse">
      <header className="sticky top-0 z-20 flex items-center gap-2 px-4 py-3 border-b border-border" style={{ paddingTop: "max(env(safe-area-inset-top), 12px)" }}>
        <div className="h-9 w-9 rounded-xl bg-[color-mix(in_oklab,var(--foreground)_10%,transparent)]" />
        <div className="flex-1 ml-2 h-5 rounded bg-[color-mix(in_oklab,var(--foreground)_10%,transparent)]" />
      </header>
      <main className="flex-1 p-4 space-y-6 mt-4">
        <div className="space-y-4">
          <div className="h-4 w-24 rounded bg-[color-mix(in_oklab,var(--foreground)_10%,transparent)]" />
          <div className="h-16 w-full rounded-2xl bg-[color-mix(in_oklab,var(--foreground)_10%,transparent)]" />
          <div className="h-16 w-full rounded-2xl bg-[color-mix(in_oklab,var(--foreground)_10%,transparent)]" />
          <div className="h-16 w-full rounded-2xl bg-[color-mix(in_oklab,var(--foreground)_10%,transparent)]" />
        </div>
      </main>
    </div>
  );
}

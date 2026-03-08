"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type DashboardShellProps = {
  children: React.ReactNode;
  stats: {
    totalUpdates: number;
    weekRange: string;
  };
};

const navItems = [
  { href: "/home", label: "Home" },
  { href: "/updates", label: "Updates" },
  { href: "/insights", label: "Insights" },
  { href: "/use-cases", label: "Use Cases" },
];

export function DashboardShell({ children, stats }: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#08111f_0%,#081829_28%,#0a1d2f_100%)] text-stone-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.15),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:90px_90px]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col lg:flex-row">
        <aside className="border-b border-white/10 bg-slate-950/45 px-5 py-6 backdrop-blur-xl lg:min-h-screen lg:w-[300px] lg:border-b-0 lg:border-r lg:px-7 lg:py-8">
          <div className="animate-rise">
            <div className="mb-8 flex items-center justify-between lg:block">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.36em] text-cyan-200/80">
                  Internal Intelligence
                </p>
                <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl leading-none text-white">
                  OpenAI Weekly Brief
                </h1>
              </div>
              <div className="rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.24em] text-cyan-100">
                Issue 11
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-300/70">
                Briefing Window
              </p>
              <p className="mt-3 text-lg font-medium text-white">{stats.weekRange}</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                  <p className="text-[0.65rem] uppercase tracking-[0.24em] text-stone-300/60">
                    Verified
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {stats.totalUpdates.toString().padStart(2, "0")}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                  <p className="text-[0.65rem] uppercase tracking-[0.24em] text-stone-300/60">
                    Signal
                  </p>
                  <p className="mt-2 text-sm font-medium text-cyan-100">
                    Platform expansion
                  </p>
                </div>
              </div>
            </div>

            <nav className="mt-8 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition duration-200 ${
                      isActive
                        ? "border-cyan-300/40 bg-cyan-300/12 text-white shadow-[0_18px_40px_rgba(15,118,110,0.24)]"
                        : "border-white/8 bg-white/4 text-stone-300 hover:border-white/16 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 rounded-[28px] border border-white/10 bg-[#10243a]/85 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/75">
                This Week&apos;s Read
              </p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-2xl leading-tight text-white">
                AI is becoming workflow infrastructure.
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-300/80">
                OpenAI is pushing into spreadsheets, desktop endpoints, and
                longer-context knowledge workflows while shipping more explicit
                governance artifacts alongside the capability releases.
              </p>
            </div>
          </div>
        </aside>

        <main className="flex-1 px-5 py-6 sm:px-7 lg:px-10 lg:py-9">
          <div className="mx-auto max-w-[1180px] animate-rise">{children}</div>
        </main>
      </div>
    </div>
  );
}

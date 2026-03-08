import Link from "next/link";

import { getDashboardData } from "@/lib/intel";

export default function HomePage() {
  const { brief, updates, signals, featuredUpdates, spotlight, latestDate, earliestDate } =
    getDashboardData();

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[38px] border border-white/10 bg-white/8 p-6 shadow-[0_28px_70px_rgba(0,0,0,0.22)] sm:p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/74">
            Week in review
          </p>
          <h2 className="mt-4 max-w-4xl font-[family-name:var(--font-display)] text-4xl leading-tight text-white sm:text-5xl">
            OpenAI widened enterprise surface area while making frontier models
            easier to evaluate and operationalize.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-stone-200/82">
            {brief.executive_summary[0]}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/updates"
              className="rounded-full border border-cyan-300/36 bg-cyan-300/12 px-5 py-3 text-xs font-medium uppercase tracking-[0.24em] text-cyan-50 transition hover:bg-cyan-300/18"
            >
              Review updates
            </Link>
            <Link
              href="/insights"
              className="rounded-full border border-white/10 bg-white/6 px-5 py-3 text-xs font-medium uppercase tracking-[0.24em] text-stone-100 transition hover:bg-white/10"
            >
              Read leadership memo
            </Link>
          </div>
        </div>

        <div className="rounded-[38px] border border-white/10 bg-[#10243a]/88 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.34em] text-cyan-100/72">
            Coverage window
          </p>
          <div className="mt-4 rounded-[30px] border border-white/10 bg-slate-950/48 p-5">
            <p className="font-[family-name:var(--font-display)] text-3xl text-white">
              {earliestDate}
            </p>
            <p className="mt-1 text-sm uppercase tracking-[0.22em] text-stone-300/72">
              to {latestDate}
            </p>
          </div>
          <div className="mt-5 space-y-3">
            {signals.map((signal) => (
              <div
                key={signal.label}
                className="rounded-[24px] border border-white/10 bg-white/6 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-cyan-100/74">
                      {signal.label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-300/80">
                      {signal.detail}
                    </p>
                  </div>
                  <p className="text-3xl font-semibold text-white">{signal.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        {featuredUpdates.map((item, index) => (
          <Link
            key={item.id}
            href="/updates"
            className="group rounded-[30px] border border-white/10 bg-slate-950/52 p-5 transition hover:-translate-y-1 hover:border-cyan-300/32 hover:bg-[#0f2238]"
          >
            <p className="text-[0.65rem] uppercase tracking-[0.26em] text-cyan-100/70">
              Priority {index + 1}
            </p>
            <h3 className="mt-4 text-xl font-semibold leading-snug text-white">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-stone-300/78">
              {item.summary}
            </p>
            <p className="mt-5 text-[0.7rem] uppercase tracking-[0.22em] text-stone-300/60">
              {item.source_type} • {item.published_human}
            </p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[36px] border border-white/10 bg-white/7 p-6 sm:p-7">
          <p className="text-xs uppercase tracking-[0.34em] text-cyan-100/74">
            Leadership signal
          </p>
          <h3 className="mt-4 font-[family-name:var(--font-display)] text-3xl leading-tight text-white">
            {spotlight.title}
          </h3>
          <p className="mt-4 text-sm leading-7 text-stone-200/82">
            {spotlight.summary}
          </p>
          <div className="mt-6 grid gap-4">
            <div className="rounded-[24px] border border-white/10 bg-[#0d2035] p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.26em] text-cyan-100/74">
                Capability
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-200/84">
                {spotlight.key_technical_capability}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-[#0d2035] p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.26em] text-cyan-100/74">
                Business angle
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-200/84">
                {spotlight.business_impact_for_knowledge_workers}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[36px] border border-white/10 bg-slate-950/52 p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-cyan-100/74">
                Release timeline
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-white">
                Verified sequence
              </h3>
            </div>
            <Link
              href="/updates"
              className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-stone-100 transition hover:bg-white/8"
            >
              Full detail
            </Link>
          </div>

          <div className="mt-6 space-y-5">
            {updates.items.map((item) => (
              <div key={item.id} className="relative pl-8">
                <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-cyan-300/60 via-white/16 to-transparent" />
                <div className="absolute left-[-5px] top-2 h-3 w-3 rounded-full border border-cyan-200/70 bg-cyan-300/90" />
                <p className="text-[0.68rem] uppercase tracking-[0.26em] text-cyan-100/74">
                  {item.published_human}
                </p>
                <p className="mt-2 text-lg font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-stone-300/78">
                  {item.why_it_matters}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

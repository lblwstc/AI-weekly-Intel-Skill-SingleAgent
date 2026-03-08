import { getBriefPayload, getUpdatesPayload } from "@/lib/intel";

export default function InsightsPage() {
  const brief = getBriefPayload();
  const updates = getUpdatesPayload();

  return (
    <div className="space-y-8">
      <section className="rounded-[38px] border border-white/10 bg-white/8 p-6 shadow-[0_28px_70px_rgba(0,0,0,0.22)] sm:p-8">
        <p className="text-xs uppercase tracking-[0.34em] text-cyan-100/72">
          Executive summary
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight text-white">
          Business implications from this week&apos;s OpenAI release cycle
        </h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {brief.executive_summary.map((paragraph) => (
            <div
              key={paragraph.slice(0, 24)}
              className="rounded-[28px] border border-white/10 bg-[#0d2035] p-5"
            >
              <p className="text-sm leading-7 text-stone-200/82">{paragraph}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[36px] border border-white/10 bg-slate-950/52 p-6 sm:p-7">
          <p className="text-xs uppercase tracking-[0.34em] text-cyan-100/72">
            Top innovations
          </p>
          <div className="mt-5 space-y-4">
            {brief.top_innovations.map((item) => (
              <div
                key={item.title}
                className="rounded-[28px] border border-white/10 bg-white/6 p-5"
              >
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-300/80">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[36px] border border-white/10 bg-[#10243a]/88 p-6 sm:p-7">
          <p className="text-xs uppercase tracking-[0.34em] text-cyan-100/72">
            Intelligence summary
          </p>
          <div className="mt-5 grid gap-4">
            <div className="rounded-[26px] border border-white/10 bg-slate-950/50 p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.26em] text-cyan-100/72">
                Sources reviewed
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {updates.summary.total_updates}
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-300/78">
                Official product, platform, research, and release-note updates.
              </p>
            </div>
            <div className="rounded-[26px] border border-white/10 bg-slate-950/50 p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.26em] text-cyan-100/72">
                Core pattern
              </p>
              <p className="mt-3 text-lg font-medium text-white">
                Workflow integration + stronger governance packaging
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-300/78">
                OpenAI is widening access at the same time it is making approval
                and review easier for enterprise stakeholders.
              </p>
            </div>
            <div className="rounded-[26px] border border-white/10 bg-slate-950/50 p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.26em] text-cyan-100/72">
                Immediate takeaway
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-300/82">
                The question for enterprise teams is shifting from &quot;Should we try
                AI?&quot; to &quot;Which workflows should now be redesigned around it?&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[36px] border border-white/10 bg-white/8 p-6 sm:p-7">
          <p className="text-xs uppercase tracking-[0.34em] text-cyan-100/72">
            Enterprise productivity implications
          </p>
          <div className="mt-5 space-y-4">
            {brief.implications.map((item) => (
              <div
                key={item.title}
                className="rounded-[28px] border border-white/10 bg-[#0d2035] p-5"
              >
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-200/82">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[36px] border border-white/10 bg-slate-950/52 p-6 sm:p-7">
            <p className="text-xs uppercase tracking-[0.34em] text-cyan-100/72">
              Risks and limitations
            </p>
            <div className="mt-5 space-y-3">
              {brief.risks.map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-stone-300/80"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[36px] border border-white/10 bg-[#10243a]/88 p-6 sm:p-7">
            <p className="text-xs uppercase tracking-[0.34em] text-cyan-100/72">
              Strategic outlook
            </p>
            <div className="mt-5 space-y-3">
              {brief.strategic_outlook.map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-white/10 bg-slate-950/48 p-4 text-sm leading-7 text-stone-300/80"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

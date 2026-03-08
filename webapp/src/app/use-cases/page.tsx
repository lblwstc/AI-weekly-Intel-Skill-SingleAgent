import { getBriefPayload, getUpdatesPayload } from "@/lib/intel";

export default function UseCasesPage() {
  const brief = getBriefPayload();
  const updates = getUpdatesPayload();
  const updateMap = new Map(updates.items.map((item) => [item.id, item]));

  return (
    <div className="space-y-8">
      <section className="rounded-[38px] border border-white/10 bg-white/8 p-6 shadow-[0_28px_70px_rgba(0,0,0,0.22)] sm:p-8">
        <p className="text-xs uppercase tracking-[0.34em] text-cyan-100/72">
          Practical applications
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight text-white">
          Workflows that can be deployed from this week&apos;s releases
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-8 text-stone-200/82">
          These scenarios combine the new model, integration, platform, and
          governance signals into operating patterns a strategy, finance,
          engineering, or research organization could actually pilot.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {brief.use_cases.map((item, index) => (
          <article
            key={item.title}
            className="rounded-[36px] border border-white/10 bg-slate-950/52 p-6 transition hover:-translate-y-1 hover:border-cyan-300/28 hover:bg-[#10243a]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.26em] text-cyan-100/72">
                  Workflow {index + 1}
                </p>
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl leading-tight text-white">
                  {item.title}
                </h3>
              </div>
              <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-stone-200/82">
                {item.persona}
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-white/10 bg-white/6 p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.26em] text-cyan-100/72">
                Suggested workflow
              </p>
              <ol className="mt-4 space-y-3">
                {item.workflow.map((step) => (
                  <li
                    key={step}
                    className="rounded-[22px] border border-white/10 bg-[#0d2035] px-4 py-3 text-sm leading-7 text-stone-200/82"
                  >
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-[28px] border border-white/10 bg-[#0d2035] p-5">
                <p className="text-[0.68rem] uppercase tracking-[0.26em] text-cyan-100/72">
                  Expected value
                </p>
                <p className="mt-3 text-sm leading-7 text-stone-200/82">
                  {item.impact}
                </p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-[#0d2035] p-5">
                <p className="text-[0.68rem] uppercase tracking-[0.26em] text-cyan-100/72">
                  Enabling updates
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.related_updates.map((updateId) => {
                    const update = updateMap.get(updateId);
                    if (!update) {
                      return null;
                    }

                    return (
                      <span
                        key={updateId}
                        className="rounded-full border border-cyan-300/26 bg-cyan-300/10 px-3 py-2 text-xs uppercase tracking-[0.22em] text-cyan-50"
                      >
                        {update.title}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

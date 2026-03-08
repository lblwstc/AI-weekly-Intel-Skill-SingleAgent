"use client";

import { useMemo, useState } from "react";

import type { UpdateItem } from "@/lib/intel";

type UpdatesExplorerProps = {
  items: UpdateItem[];
};

const filters = ["All", "Product", "Platform", "Safety", "Research"] as const;

export function UpdatesExplorer({ items }: UpdatesExplorerProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesFilter = filter === "All" || item.source_type === filter;
      if (!matchesFilter) {
        return false;
      }
      if (!query) {
        return true;
      }
      return [
        item.title,
        item.summary,
        item.source,
        item.key_technical_capability,
        item.example_use_case,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [filter, items, search]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 rounded-[34px] border border-white/10 bg-slate-950/55 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)] sm:grid-cols-[1.3fr_0.7fr] sm:p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-stone-300/70">
            Explorer
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-white">
            Search the verified release set
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-300/78">
            Each card is sourced to an official OpenAI page or release note and
            expanded with business context for knowledge workers.
          </p>
        </div>
        <div className="rounded-[28px] border border-cyan-300/18 bg-cyan-300/8 p-4">
          <p className="text-[0.72rem] uppercase tracking-[0.25em] text-cyan-100/80">
            Current Filter
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">{filter}</p>
          <p className="mt-2 text-sm text-stone-300/78">
            {filteredItems.length} of {items.length} updates visible
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="space-y-4 rounded-[34px] border border-white/10 bg-slate-950/50 p-5 sm:p-6">
          <label className="block">
            <span className="text-[0.72rem] uppercase tracking-[0.28em] text-stone-300/70">
              Search
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-white/12 bg-white/6 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/45 focus:bg-white/8"
              placeholder="Search title, source, capability, or use case"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {filters.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.24em] transition ${
                  filter === option
                    ? "border-cyan-300/40 bg-cyan-300/12 text-cyan-50"
                    : "border-white/10 bg-white/5 text-stone-300 hover:border-white/16 hover:bg-white/8"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredItems.map((item) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={`w-full rounded-[24px] border p-4 text-left transition ${
                    isActive
                      ? "border-cyan-300/45 bg-[#11263f] shadow-[0_18px_45px_rgba(15,118,110,0.18)]"
                      : "border-white/8 bg-white/4 hover:border-white/16 hover:bg-white/8"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.24em] text-cyan-100/72">
                        {item.published_human}
                      </p>
                      <p className="mt-2 text-base font-semibold text-white">
                        {item.title}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-stone-300/78">
                      {item.source_type}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-stone-300/78">
                    {item.summary}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="rounded-[34px] border border-dashed border-white/12 bg-slate-950/40 p-10 text-center text-stone-300/72">
              No updates matched the current search and filter combination.
            </div>
          ) : (
            filteredItems.map((item) => {
              const expanded = item.id === activeId;
              return (
                <article
                  key={item.id}
                  className={`rounded-[34px] border p-6 transition duration-300 ${
                    expanded
                      ? "border-cyan-300/38 bg-white/9 shadow-[0_22px_56px_rgba(0,0,0,0.18)]"
                      : "border-white/10 bg-slate-950/45"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveId(expanded ? null : item.id)}
                    className="w-full text-left"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="max-w-3xl">
                        <p className="text-[0.68rem] uppercase tracking-[0.28em] text-cyan-100/74">
                          {item.source} • {item.published_human}
                        </p>
                        <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl leading-tight text-white">
                          {item.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 self-start">
                        <span className="rounded-full border border-white/12 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-stone-300/78">
                          {item.source_type}
                        </span>
                        <span className="text-xl text-cyan-100">{expanded ? "−" : "+"}</span>
                      </div>
                    </div>
                    <p className="mt-4 text-base leading-7 text-stone-200/84">
                      {item.summary}
                    </p>
                  </button>

                  {expanded ? (
                    <div className="mt-6 grid gap-4 animate-soft-reveal sm:grid-cols-2">
                      <div className="rounded-[26px] border border-white/10 bg-[#0d2035] p-5">
                        <p className="text-[0.68rem] uppercase tracking-[0.26em] text-cyan-100/74">
                          Key Capability
                        </p>
                        <p className="mt-3 text-sm leading-6 text-stone-200/84">
                          {item.key_technical_capability}
                        </p>
                      </div>
                      <div className="rounded-[26px] border border-white/10 bg-[#0d2035] p-5">
                        <p className="text-[0.68rem] uppercase tracking-[0.26em] text-cyan-100/74">
                          Example Use Case
                        </p>
                        <p className="mt-3 text-sm leading-6 text-stone-200/84">
                          {item.example_use_case}
                        </p>
                      </div>
                      <div className="rounded-[26px] border border-white/10 bg-[#0d2035] p-5">
                        <p className="text-[0.68rem] uppercase tracking-[0.26em] text-cyan-100/74">
                          Why It Matters
                        </p>
                        <p className="mt-3 text-sm leading-6 text-stone-200/84">
                          {item.why_it_matters}
                        </p>
                      </div>
                      <div className="rounded-[26px] border border-white/10 bg-[#0d2035] p-5">
                        <p className="text-[0.68rem] uppercase tracking-[0.26em] text-cyan-100/74">
                          Business Impact
                        </p>
                        <p className="mt-3 text-sm leading-6 text-stone-200/84">
                          {item.business_impact_for_knowledge_workers}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex rounded-full border border-cyan-300/34 bg-cyan-300/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-cyan-50 transition hover:bg-cyan-300/18"
                        >
                          Open source
                        </a>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

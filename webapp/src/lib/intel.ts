import fs from "node:fs";
import path from "node:path";

export type UpdateItem = {
  id: string;
  title: string;
  date: string;
  source: string;
  source_type: "Product" | "Platform" | "Safety" | "Research";
  source_url: string;
  summary: string;
  key_technical_capability: string;
  example_use_case: string;
  why_it_matters: string;
  business_impact_for_knowledge_workers: string;
  rank: number;
  published_at: string;
  published_human: string;
};

type UpdatesPayload = {
  generated_on: string;
  window: {
    start: string;
    end: string;
  };
  query: string;
  sources_reviewed: string[];
  summary: {
    total_updates: number;
    category_counts: Record<string, number>;
    distinct_sources: number;
  };
  items: UpdateItem[];
};

export type BriefSection = {
  title: string;
  detail: string;
};

export type UseCase = {
  title: string;
  persona: string;
  workflow: string[];
  impact: string;
  related_updates: string[];
};

type BriefPayload = {
  issue_title: string;
  issue_subtitle: string;
  window: {
    start: string;
    end: string;
  };
  executive_summary: string[];
  top_innovations: BriefSection[];
  implications: BriefSection[];
  use_cases: UseCase[];
  risks: string[];
  strategic_outlook: string[];
};

const projectRoot = path.resolve(process.cwd(), "..");
const updatesPath = path.join(projectRoot, "data", "ai_updates.json");
const briefPath = path.join(projectRoot, "content", "brief_sections.json");

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function getUpdatesPayload(): UpdatesPayload {
  return readJson<UpdatesPayload>(updatesPath);
}

export function getBriefPayload(): BriefPayload {
  return readJson<BriefPayload>(briefPath);
}

export function getDashboardData() {
  const updates = getUpdatesPayload();
  const brief = getBriefPayload();

  return {
    updates,
    brief,
    latestDate: updates.items[0]?.published_human ?? "",
    earliestDate: updates.items.at(-1)?.published_human ?? "",
    featuredUpdates: updates.items.slice(0, 4),
    spotlight: updates.items.find((item) => item.id === "gpt-5-4") ?? updates.items[0],
    signals: [
      {
        label: "Verified updates",
        value: updates.summary.total_updates.toString().padStart(2, "0"),
        detail: "Official sources reviewed within the last 7 days.",
      },
      {
        label: "Major product drops",
        value: `${updates.summary.category_counts.Product ?? 0}`,
        detail: "Model and workflow launches with direct user impact.",
      },
      {
        label: "Governance artifacts",
        value: `${updates.summary.category_counts.Safety ?? 0}`,
        detail: "System cards that matter for enterprise approval paths.",
      },
      {
        label: "High-leverage workflows",
        value: `${brief.use_cases.length}`,
        detail: "Concrete operating patterns enabled by this week's releases.",
      },
    ],
  };
}

export function getUpdateById(id: string) {
  return getUpdatesPayload().items.find((item) => item.id === id);
}

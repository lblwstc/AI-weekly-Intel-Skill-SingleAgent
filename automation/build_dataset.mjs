import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const manifestPath = path.join(projectRoot, "automation", "source_manifest.json");
const outputPath = path.join(projectRoot, "data", "ai_updates.json");

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const start = new Date(manifest.window.start);
const end = new Date(manifest.window.end);

const items = [...manifest.items]
  .filter((item) => {
    const date = new Date(item.date);
    return date >= start && date <= end;
  })
  .sort((left, right) => {
    if (left.date === right.date) {
      return left.title.localeCompare(right.title);
    }
    return right.date.localeCompare(left.date);
  })
  .map((item, index) => ({
    ...item,
    rank: index + 1,
    published_at: item.date,
    published_human: new Date(`${item.date}T00:00:00Z`).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }),
  }));

const category_counts = items.reduce((counts, item) => {
  counts[item.source_type] = (counts[item.source_type] ?? 0) + 1;
  return counts;
}, {});

const output = {
  generated_on: manifest.generated_on,
  window: manifest.window,
  query: "OpenAI product, platform, and research updates published in the last 7 days",
  sources_reviewed: manifest.sources_reviewed,
  summary: {
    total_updates: items.length,
    category_counts,
    distinct_sources: [...new Set(items.map((item) => item.source))].length,
  },
  items,
};

await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);

console.log(`Wrote ${items.length} updates to ${outputPath}`);

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const updatesPath = path.join(projectRoot, "data", "ai_updates.json");
const briefSectionsPath = path.join(projectRoot, "content", "brief_sections.json");
const outputPath = path.join(projectRoot, "content", "weekly_ai_brief.md");

const updates = JSON.parse(await readFile(updatesPath, "utf8"));
const brief = JSON.parse(await readFile(briefSectionsPath, "utf8"));

const updatesList = updates.items
  .map((item) => `- ${item.published_human}: ${item.title} (${item.source})`)
  .join("\n");

const topInnovations = brief.top_innovations
  .map((item) => `- **${item.title}:** ${item.detail}`)
  .join("\n");

const implications = brief.implications
  .map((item) => `- **${item.title}:** ${item.detail}`)
  .join("\n");

const useCases = brief.use_cases
  .map(
    (item) =>
      `### ${item.title}\n- Audience: ${item.persona}\n- Workflow:\n${item.workflow
        .map((step) => `  - ${step}`)
        .join("\n")}\n- Expected value: ${item.impact}`,
  )
  .join("\n\n");

const risks = brief.risks.map((item) => `- ${item}`).join("\n");
const outlook = brief.strategic_outlook.map((item) => `- ${item}`).join("\n");

const markdown = `# ${brief.issue_title}

${brief.issue_subtitle}

**Coverage window:** ${brief.window.start} to ${brief.window.end}  
**Updates reviewed:** ${updates.summary.total_updates}

## Executive Summary

${brief.executive_summary.join("\n\n")}

## Top Innovations This Week

${topInnovations}

## Implications for Enterprise Productivity

${implications}

## Example Workflows Enabled by the New Capabilities

${useCases}

## Risks and Limitations

${risks}

## Strategic Outlook

${outlook}

## Reviewed Updates

${updatesList}
`;

await writeFile(outputPath, markdown);

console.log(`Wrote weekly brief to ${outputPath}`);

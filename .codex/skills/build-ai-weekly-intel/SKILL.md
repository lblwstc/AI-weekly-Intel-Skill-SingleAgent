---
name: build-ai-weekly-intel
description: "Build end-to-end weekly AI intelligence products from current real-world updates: research the latest releases, synthesize a leadership brief, create a polished internal dashboard, and record a demo video. Use when the user asks for an autonomous AI newsletter, internal intelligence brief, strategy dashboard, demo walkthrough, or a repeatable pipeline that turns recent AI updates into a professional product."
---

# Build AI Weekly Intel

## Overview

Execute a full weekly AI intelligence workflow with minimal user supervision: collect recent updates, normalize them into structured data, synthesize business insight, ship a high-quality web experience, and produce a demo asset.

Read [references/output-contract.md](references/output-contract.md) first for the required file structure and deliverables. Read [references/research-rules.md](references/research-rules.md) before collecting sources. Read [references/ui-and-demo.md](references/ui-and-demo.md) before building the app or recording video.

## Workflow

1. Define the exact reporting window using absolute dates.
2. Browse for current updates and prefer official primary sources.
3. Save the normalized update set and the source manifest before writing UI code.
4. Write the leadership memo from the verified data, not from placeholders.
5. Build the dashboard to the enterprise-quality bar in `references/ui-and-demo.md`.
6. Record the demo only after the app builds and the key pages render correctly.
7. If narration is requested, use the `speech` skill. Prefer the OpenAI Speech API when `OPENAI_API_KEY` is present; otherwise use a local TTS fallback only if the user wants progress over waiting.
8. Validate outputs with `scripts/validate_weekly_intel.py`.

## Non-Negotiables

- Use real, current data for the requested window. Do not fabricate updates.
- Use exact dates in both research and final reporting.
- Keep the JSON dataset, memo, web app, and demo assets in sync.
- Preserve a polished internal-product feel. Avoid generic landing-page styling.
- Keep the original demo cut if post-production variants are added. Export narrated versions as separate files.

## Source Order

1. Official vendor blog or index pages
2. Official release notes or docs changelogs
3. Official help-center updates
4. Major tech media only as corroboration or tie-breaker

## Narration and Subtitle Guidance

- Reuse the recorded browser flow unless the user asks for a new walkthrough.
- Keep English narration concise and scene-aware.
- When Japanese subtitles are requested, translate the spoken script exactly and time subtitles to the narrated sections.
- If the installed `ffmpeg` build lacks subtitle or text filters, render subtitle cards as transparent PNGs and overlay them.

## Validation

Run:

```bash
python3 ~/.codex/skills/build-ai-weekly-intel/scripts/validate_weekly_intel.py <project-root>
```

The validator checks required files, dataset size, memo presence, and available demo-video specs.

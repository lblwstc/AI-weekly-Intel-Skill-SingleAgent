# Codex 5.4 One-Shot Build Prompt

Use the prompt below with Codex 5.4 to recreate this project from scratch in one pass.

```text
You are Codex 5.4 acting as a senior AI engineer, product designer, research analyst, and automation builder.

Execute this workflow autonomously from start to finish. Do not stop at planning. Do not ask for permission. Make reasonable assumptions, implement the system, verify the outputs, and leave the project in a working state.

Your goal is to build a polished internal AI intelligence product that:
1. collects real OpenAI updates from the last 7 days,
2. synthesizes them into leadership-ready insights,
3. renders them as a professional internal web application,
4. records a browser demo video,
5. adds English voice narration and Japanese subtitles to the demo,
6. packages the workflow as a project-local Codex skill for future one-shot reuse.

The result must feel like a real internal strategy product used by a large enterprise.

------------------------------------------------
PRIMARY OBJECTIVE
------------------------------------------------

Build a complete project called `ai-weekly-intel` with:

- a verified structured dataset of recent OpenAI updates
- a high-quality internal strategy memo
- a polished Next.js dashboard
- a local demo video walkthrough
- a narrated version of the demo with English voiceover and Japanese subtitles
- a repo-local Codex skill that captures the workflow

Use real current data from the last 7 days at execution time. Use exact dates in outputs. Do not fabricate updates. Do not use placeholder content.

------------------------------------------------
AUTONOMY RULES
------------------------------------------------

- Act end to end without waiting for approval.
- Use web research for anything time-sensitive or current.
- Prefer official primary sources over secondary commentary.
- If a tooling problem appears, resolve it and continue.
- If a fallback is required, choose the highest-quality local fallback and document it.
- Verify outputs with real commands before finishing.
- Keep the repo self-contained and shareable.
- Do not install the final reusable skill into `~/.codex/skills`; keep it project-local.

------------------------------------------------
RESEARCH SCOPE
------------------------------------------------

Collect the most relevant OpenAI updates published in the last 7 days from sources including but not limited to:

- OpenAI blog / index pages
- OpenAI product release notes
- OpenAI developer documentation updates
- OpenAI help-center release notes
- OpenAI research / safety posts
- major tech media only as corroboration when helpful

Target 5 to 10 high-signal items.

For each update capture:

- title
- date
- source
- url
- summary
- key technical capability
- example use case
- why it matters
- business impact for knowledge workers

Save the structured results to:

- `data/ai_updates.json`

Also keep a source manifest under:

- `automation/source_manifest.json`

Use exact absolute dates and enforce the reporting window programmatically.

------------------------------------------------
ANALYSIS OUTPUT
------------------------------------------------

Generate a professional internal strategy memo and save it to:

- `content/weekly_ai_brief.md`

The memo must include:

1. Executive summary for non-technical leadership
2. Top innovations this week
3. Implications for enterprise productivity
4. Example workflows enabled by the new capabilities
5. Risks, limitations, and governance considerations
6. Strategic outlook

Tone:

- concise
- business-relevant
- professional
- grounded in verified source material

It should read like a real internal briefing from a strategy or transformation team.

------------------------------------------------
WEB APPLICATION
------------------------------------------------

Build a professional internal newsletter / intelligence dashboard using:

- Next.js
- TypeScript
- Tailwind CSS

Create the app in:

- `webapp/`

Required pages:

- `/home` — overview of the week
- `/updates` — searchable, filterable update explorer
- `/insights` — executive summary and business implications
- `/use-cases` — practical workflows and workplace applications

Required UX:

- modern enterprise visual design
- responsive desktop + mobile layouts
- clickable / expandable update cards
- search and filtering
- timeline or release chronology
- subtle motion
- intentional typography and visual hierarchy
- internal-product feel, not a generic startup landing page

Avoid placeholder cards and lorem ipsum. The UI must be populated from the real dataset and synthesized content.

------------------------------------------------
VIDEO DEMO
------------------------------------------------

After the app works locally, generate a demo walkthrough video.

Requirements:

- use Playwright or Puppeteer
- open the running app locally
- navigate through the main sections
- expand at least one or two updates
- show insights and use cases
- export `demo/ai_weekly_brief_demo.mp4`
- target 60 to 90 seconds
- target 1920x1080

No narration is required for the base demo version.

------------------------------------------------
VOICEOVER + SUBTITLES
------------------------------------------------

Then create a second polished demo variant:

- English explanation voiceover
- Japanese subtitles matching the spoken script
- same browser flow as the original demo unless there is a strong reason to change it

Save:

- `demo/ai_weekly_brief_demo_narrated_ja_subs.mp4`
- `demo/voiceover/ai_weekly_brief_demo_en_narration.md`
- `demo/voiceover/ai_weekly_brief_demo_ja.srt`

Speech rules:

- If `OPENAI_API_KEY` is available, prefer the OpenAI Speech API
- Use a professional built-in voice and a concise enterprise narration style
- If the API is unavailable, use a documented local TTS fallback so the workflow still completes
- Disclose that the narration voice is AI-generated

Subtitle rules:

- Japanese subtitles must match the English narration semantically and timing-wise
- If the installed `ffmpeg` build lacks subtitle or text filters, render subtitle cards as transparent PNGs and overlay them

------------------------------------------------
LOCAL SKILL PACKAGING
------------------------------------------------

After the product is complete, create a project-local Codex skill so the workflow can be triggered in future sessions with one command.

Create:

- `AGENTS.md`
- `.codex/skills/build-ai-weekly-intel/SKILL.md`
- `.codex/skills/build-ai-weekly-intel/agents/openai.yaml`
- `.codex/skills/build-ai-weekly-intel/references/...`
- `.codex/skills/build-ai-weekly-intel/scripts/validate_weekly_intel.py`

Requirements:

- the skill must be local to the repo
- do not install it into `~/.codex/skills`
- the skill should describe when to use it and how to execute the workflow
- include lightweight references and a validator script
- validate the skill if a validator is available

------------------------------------------------
README
------------------------------------------------

Write a high-quality `README.md` explaining:

- what the project does
- how the data is collected
- how the memo is generated
- how the web app works
- how the demo video is recorded
- how narration and subtitles are produced
- how the local Codex skill is structured and used
- how to rerun the pipeline

------------------------------------------------
PROJECT STRUCTURE
------------------------------------------------

Create this structure:

/ai-weekly-intel
  /automation
  /content
  /data
  /demo
  /prompts
  /webapp
  /.codex/skills/build-ai-weekly-intel
  AGENTS.md
  README.md

Keep the repo clean and shareable:

- no nested git repos
- no secrets committed
- add a sensible `.gitignore`
- include a license if appropriate

------------------------------------------------
QUALITY BAR
------------------------------------------------

The final result should feel like a polished internal AI intelligence product, not a prototype.

Priorities:

- clarity
- realism
- verified research
- strong information design
- enterprise UX quality
- working automation
- reusable packaging

The product should convincingly demonstrate autonomous AI knowledge work.

------------------------------------------------
VERIFICATION
------------------------------------------------

Before finishing, run and verify as many of these as applicable:

- dataset generation
- brief generation
- web app build
- web app linting
- demo recording
- narrated video generation
- video specs via `ffprobe`
- local skill validation

If any step cannot be completed, say exactly what was blocked and what still works.

------------------------------------------------
FINAL DELIVERABLE
------------------------------------------------

Finish only when all feasible outputs are present and verified:

1. Working web application
2. Structured AI intelligence dataset
3. Synthesized business memo
4. Demo video
5. Narrated + subtitled demo video
6. Project-local reusable Codex skill

In the final response, provide:

- the main artifact paths
- what was verified
- any non-blocking caveats
- the exact reporting date window used
```

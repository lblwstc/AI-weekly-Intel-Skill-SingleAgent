# AI Weekly Intel

An autonomous internal-intelligence product that collects recent OpenAI updates, synthesizes them into a leadership-ready brief, renders them as a polished dashboard, and records a browser walkthrough video.

## What this project does

- Collects verified OpenAI product, platform, research, and safety updates published between `2026-02-28` and `2026-03-07`
- Normalizes those updates into a structured dataset at `data/ai_updates.json`
- Produces a strategy-style memo at `content/weekly_ai_brief.md`
- Serves a responsive Next.js dashboard with `/home`, `/updates`, `/insights`, and `/use-cases`
- Records a local walkthrough video to `demo/ai_weekly_brief_demo.mp4`

## Pipeline

### 1. Data collection

The source set for this run was verified from recent OpenAI web pages and release notes, then captured in `automation/source_manifest.json`.

Primary sources used in this run:

- `https://openai.com/index/gpt-5-3-instant-update/`
- `https://openai.com/index/gpt-5-3-instant-system-card/`
- `https://help.openai.com/en/articles/6825453-chatgpt-release-notes`
- `https://openai.com/index/extending-single-minus-amplitudes-to-gravitons/`
- `https://openai.com/index/introducing-gpt-5-4/`
- `https://openai.com/index/chatgpt-for-excel-and-new-financial-data-integrations/`
- `https://openai.com/index/gpt-5-4-thinking-system-card/`
- `https://openai.com/index/codex-security/`

Corroborating tech-media search was used during research, but the final dataset is grounded in official OpenAI pages and release notes.

Run:

```bash
npm run build:data
```

This reads `automation/source_manifest.json`, enforces the date window, sorts the updates, and writes `data/ai_updates.json`.

### 2. Insight generation

The business-analysis blueprint lives in `content/brief_sections.json`.

Run:

```bash
npm run build:brief
```

This renders the final internal memo at `content/weekly_ai_brief.md`.

### 3. Web application

The dashboard is a Next.js + TypeScript + Tailwind application in `webapp/`.

Key UX elements:

- Corporate intelligence dashboard styling
- Sticky navigation shell
- Search and filtering on updates
- Expandable update cards
- Insight panels for leadership
- Practical workflow cards
- Mobile-responsive layouts and subtle motion

Run locally:

```bash
npm --prefix webapp run dev
```

Or build for production:

```bash
npm --prefix webapp run build
npm --prefix webapp run start
```

### 4. Demo video generation

The video generator lives in `automation/record_demo.mjs`.

What it does:

- Starts the built Next.js app on `http://127.0.0.1:3000`
- Launches local Google Chrome through Playwright
- Walks through `/home`, `/updates`, `/insights`, and `/use-cases`
- Interacts with search, filters, and expandable cards
- Captures a 1920x1080 browser recording
- Converts the Playwright `.webm` output to `demo/ai_weekly_brief_demo.mp4` using `ffmpeg`

Run:

```bash
npm run record:demo
```

Prerequisites:

- Google Chrome installed at `/Applications/Google Chrome.app`
- `ffmpeg` available on the system path
- Root dependencies installed with `npm install`
- Web app dependencies installed with `npm --prefix webapp install`
- Production build already created with `npm --prefix webapp run build`

## Full regeneration

```bash
npm install
npm --prefix webapp install
npm run pipeline
```

The `pipeline` script executes:

1. `npm run build:data`
2. `npm run build:brief`
3. `npm run build:webapp`
4. `npm run record:demo`

## Project structure

```text
ai-weekly-intel/
  automation/
    build_dataset.mjs
    generate_brief.mjs
    record_demo.mjs
    source_manifest.json
  content/
    brief_sections.json
    weekly_ai_brief.md
  data/
    ai_updates.json
  demo/
    ai_weekly_brief_demo.mp4
  webapp/
    ...
  README.md
```

## Outputs produced in this run

- Structured dataset: `data/ai_updates.json`
- Strategy memo: `content/weekly_ai_brief.md`
- Web app: `webapp/`
- Demo video: `demo/ai_weekly_brief_demo.mp4`
- Narrated demo with Japanese subtitles: `demo/ai_weekly_brief_demo_narrated_ja_subs.mp4`

## Narration and subtitles

The project also includes a localized post-production step for the demo video:

- English voiceover audio uses the OpenAI Speech API when `OPENAI_API_KEY` is set
- If no API key is available, the script falls back to macOS text-to-speech so the workflow still completes locally
- Japanese subtitles are exported as `demo/voiceover/ai_weekly_brief_demo_ja.srt`
- Subtitle cards are rendered as transparent PNG overlays for compatibility with the installed `ffmpeg` build
- The final narrated video is exported to `demo/ai_weekly_brief_demo_narrated_ja_subs.mp4`

Run:

```bash
npm run voiceover:demo
```

Supporting assets:

- English narration script: `demo/voiceover/ai_weekly_brief_demo_en_narration.md`
- Japanese subtitle file: `demo/voiceover/ai_weekly_brief_demo_ja.srt`
- Subtitle overlay cards: `demo/voiceover/cards/`

Disclosure: the narration voice is AI-generated.

## Local Codex skill

This repo now includes a project-local skill at `.codex/skills/build-ai-weekly-intel/`.

- It is scoped to this repo rather than your global `~/.codex/skills` directory
- The local trigger instructions live in `AGENTS.md`
- To use it in a future Codex session, start Codex in this repo and ask for `$build-ai-weekly-intel`

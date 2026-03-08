# UI And Demo

## Dashboard Bar

Aim for an internal corporate intelligence product, not a startup marketing page.

- Use strong information hierarchy.
- Prefer a dashboard shell with navigation.
- Avoid generic hero-only layouts.
- Use a distinctive but credible visual system.
- Support both desktop and mobile without feeling like a theme template.

## Recommended Views

- `home`: weekly overview, signal cards, featured updates, timeline
- `updates`: searchable, filterable, expandable update explorer
- `insights`: executive summary, implications, risks, outlook
- `use-cases`: practical workflows and business applications

## Demo Recording

- Build the app first.
- Drive the browser with automation, not manual clicking.
- Use deliberate pauses between sections.
- Keep the cut around 60 to 90 seconds unless the user wants otherwise.
- Record at 1920x1080 when possible.

## Narration

- Use the `speech` skill if voiceover is requested.
- Keep the spoken script short, scene-matched, and business-focused.
- If the Speech API stalls or fails repeatedly, keep a local TTS fallback so the project remains deliverable.

## Subtitles

- Burn in subtitles only if the environment supports it cleanly.
- If `ffmpeg` lacks subtitle or drawtext filters, pre-render subtitle cards and overlay them.
- Keep subtitle text faithful to the spoken English script when translating.

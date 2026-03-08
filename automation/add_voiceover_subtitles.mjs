import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const demoDir = path.join(projectRoot, "demo");
const tmpDir = path.join(projectRoot, "tmp", "voiceover");

const sourceVideo = path.join(demoDir, "ai_weekly_brief_demo.mp4");
const outputVideo = path.join(demoDir, "ai_weekly_brief_demo_narrated_ja_subs.mp4");
const outputAudio = path.join(demoDir, "voiceover", "ai_weekly_brief_demo_narration.m4a");
const outputSrt = path.join(demoDir, "voiceover", "ai_weekly_brief_demo_ja.srt");
const outputScript = path.join(demoDir, "voiceover", "ai_weekly_brief_demo_en_narration.md");
const cardsDir = path.join(demoDir, "voiceover", "cards");
const segmentsPath = path.join(projectRoot, "automation", "voiceover_segments.json");
const subtitleCardScript = path.join(projectRoot, "automation", "render_subtitle_cards.py");
const speechCli = "/Users/bolunli/.codex/skills/speech/scripts/text_to_speech.py";
const speechTmpDir = path.join(projectRoot, "tmp", "speech");

const sayBinary = "/usr/bin/say";
const ffmpegBinary = "ffmpeg";
const ffprobeBinary = "ffprobe";
const macOsVoice = "Eddy (English (US))";
const macOsBaseRate = 155;
const openAiVoice = "cedar";
const openAiModel = "gpt-4o-mini-tts-2025-12-15";
const openAiBaseSpeed = 1.08;
const openAiInstructions = `Voice Affect: Confident and composed.
Tone: Helpful and professional.
Pacing: Steady, slightly brisk.
Pauses: Allow short pauses between sections.
Emphasis: Stress verified updates, business impact, and reusable internal product.
Delivery: Clean enterprise demo voiceover.`;

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? projectRoot,
      env: {
        ...process.env,
        ...(options.env ?? {}),
      },
      stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
    });

    let stdout = "";
    let stderr = "";

    if (options.capture) {
      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
    }

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(
        new Error(
          `${command} ${args.join(" ")} exited with code ${code}${
            stderr ? `\n${stderr}` : ""
          }`,
        ),
      );
    });
  });
}

async function probeDuration(filePath) {
  const { stdout } = await runCommand(
    ffprobeBinary,
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      filePath,
    ],
    { capture: true },
  );

  return Number.parseFloat(stdout.trim());
}

function hasOpenAiKey() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

function getAvailableWindow(segment) {
  return Math.max(0.5, segment.end - segment.start - 0.2);
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function estimateMinimumDuration(segment) {
  const wordCount = segment.english.trim().split(/\s+/).filter(Boolean).length;
  return Math.min(
    Math.max(1.6, wordCount * 0.22),
    Math.max(1.8, getAvailableWindow(segment) * 0.7),
  );
}

function toSrtTimestamp(totalSeconds) {
  const millis = Math.round(totalSeconds * 1000);
  const hours = Math.floor(millis / 3_600_000);
  const minutes = Math.floor((millis % 3_600_000) / 60_000);
  const seconds = Math.floor((millis % 60_000) / 1000);
  const remainder = millis % 1000;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":")
    .concat(`,${String(remainder).padStart(3, "0")}`);
}

async function renderSegmentWithSay(segment) {
  const outputPath = path.join(tmpDir, `${segment.id}.aiff`);
  const availableWindow = getAvailableWindow(segment);

  let rate = macOsBaseRate;
  let duration = 0;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    await runCommand(sayBinary, [
      "-v",
      macOsVoice,
      "-r",
      String(rate),
      "-o",
      outputPath,
      segment.english,
    ]);

    duration = await probeDuration(outputPath);
    if (duration <= availableWindow) {
      return { filePath: outputPath, duration, rate };
    }

    rate = Math.min(
      220,
      Math.ceil((rate * duration * 1.03) / Math.max(availableWindow, 0.5)),
    );
  }

  return { filePath: outputPath, duration, rate };
}

async function renderSegmentsWithSay(segments) {
  const renderedSegments = [];

  for (const segment of segments) {
    renderedSegments.push({
      ...segment,
      ...(await renderSegmentWithSay(segment)),
    });
  }

  return renderedSegments;
}

async function renderSegmentsWithOpenAi(segments) {
  const outputDir = path.join(tmpDir, "openai-segments");
  const instructionsPath = path.join(speechTmpDir, "voiceover_instructions.txt");

  await mkdir(outputDir, { recursive: true });
  await mkdir(speechTmpDir, { recursive: true });
  await writeFile(instructionsPath, `${openAiInstructions}\n`);

  async function runSpeechClip(segment, outputPath, speed) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        console.log(
          `Generating OpenAI speech for ${segment.id} at ${speed.toFixed(2)}x`,
        );
        await runCommand("python3", [
          speechCli,
          "speak",
          "--input",
          segment.english,
          "--out",
          outputPath,
          "--model",
          openAiModel,
          "--voice",
          openAiVoice,
          "--response-format",
          "mp3",
          "--speed",
          String(speed),
          "--instructions-file",
          instructionsPath,
          "--attempts",
          "5",
          "--force",
        ]);
        return;
      } catch (error) {
        if (attempt === 2) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  const renderedSegments = [];

  for (const segment of segments) {
    const outputPath = path.join(outputDir, `${segment.id}.mp3`);
    const availableWindow = getAvailableWindow(segment);
    const minimumDuration = estimateMinimumDuration(segment);
    let speed = openAiBaseSpeed;
    let duration = 0;

    for (let attempt = 0; attempt < 4; attempt += 1) {
      await runSpeechClip(segment, outputPath, speed);
      duration = await probeDuration(outputPath);
      if (duration < minimumDuration) {
        console.log(
          `Retrying ${segment.id}: duration ${duration.toFixed(
            2,
          )}s looks truncated for the script.`,
        );
        continue;
      }
      if (duration <= availableWindow) {
        break;
      }

      speed = clamp(
        Math.max(speed + 0.06, (speed * duration * 1.03) / availableWindow),
        1.0,
        1.85,
      );
    }

    renderedSegments.push({
      ...segment,
      filePath: outputPath,
      duration,
      speed: Number(speed.toFixed(2)),
    });
  }

  await rm(instructionsPath, { force: true });
  return renderedSegments;
}

function buildSubtitleFile(segments) {
  return `${segments
    .map(
      (segment, index) =>
        `${index + 1}
${toSrtTimestamp(segment.start)} --> ${toSrtTimestamp(segment.end)}
${segment.japanese}`,
    )
    .join("\n\n")}\n`;
}

function buildScriptFile(segments, provider) {
  const providerSummary =
    provider === "openai"
      ? `Provider: OpenAI Speech API\nModel: ${openAiModel}\nVoice: ${openAiVoice}\nBase speed: ${openAiBaseSpeed}\nMode: scene-by-scene narration segments`
      : `Provider: macOS text-to-speech\nVoice: ${macOsVoice}\nBase speech rate: ${macOsBaseRate}`;

  return `# English Demo Narration

${providerSummary}

${segments
  .map(
    (segment) =>
      `- ${segment.start.toFixed(1)}s to ${segment.end.toFixed(1)}s: ${segment.english}`,
  )
  .join("\n")}
`;
}

async function buildNarrationAudio(videoDuration, renderedSegments) {
  const inputs = [
    "-y",
    "-f",
    "lavfi",
    "-t",
    String(videoDuration),
    "-i",
    "anullsrc=r=44100:cl=stereo",
  ];

  for (const segment of renderedSegments) {
    inputs.push("-i", segment.filePath);
  }

  const mixFilters = renderedSegments.map((segment, index) => {
    const delay = Math.max(0, Math.round(segment.start * 1000));
    return `[${index + 1}:a]adelay=${delay}|${delay}[a${index}]`;
  });

  const mixInputs = ["[0:a]", ...renderedSegments.map((_, index) => `[a${index}]`)].join("");
  const filterComplex = `${mixFilters.join(";")};${mixInputs}amix=inputs=${
    renderedSegments.length + 1
  }:duration=longest:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11[aout]`;

  await runCommand(ffmpegBinary, [
    ...inputs,
    "-filter_complex",
    filterComplex,
    "-map",
    "[aout]",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    outputAudio,
  ]);
}

async function renderSubtitleCards() {
  await runCommand("python3", [subtitleCardScript, segmentsPath, cardsDir]);
}

async function renderFinalVideo(renderedSegments) {
  const inputs = [
    "-y",
    "-i",
    sourceVideo,
    "-i",
    outputAudio,
  ];

  for (const segment of renderedSegments) {
    inputs.push("-loop", "1", "-i", path.join(cardsDir, `${segment.id}.png`));
  }

  const overlayFilters = [];
  let currentStream = "[0:v]";

  renderedSegments.forEach((segment, index) => {
    const inputStream = `[${index + 2}:v]`;
    const outputStream =
      index === renderedSegments.length - 1 ? "[vout]" : `[v${index}]`;
    overlayFilters.push(
      `${currentStream}${inputStream}overlay=x=0:y=H-h-24:enable='between(t,${segment.start},${segment.end})'${outputStream}`,
    );
    currentStream = outputStream;
  });

  await runCommand(ffmpegBinary, [
    ...inputs,
    "-filter_complex",
    overlayFilters.join(";"),
    "-map",
    "[vout]",
    "-map",
    "1:a:0",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "20",
    "-c:a",
    "copy",
    "-shortest",
    "-movflags",
    "+faststart",
    outputVideo,
  ]);
}

async function main() {
  if (!existsSync(sourceVideo)) {
    throw new Error(`Source video not found: ${sourceVideo}`);
  }

  await rm(tmpDir, { recursive: true, force: true });
  await mkdir(path.join(demoDir, "voiceover"), { recursive: true });
  await mkdir(tmpDir, { recursive: true });

  const rawSegments = JSON.parse(await readFile(segmentsPath, "utf8"));
  const videoDuration = await probeDuration(sourceVideo);
  const provider = hasOpenAiKey() ? "openai" : "say";
  const renderedSegments =
    provider === "openai"
      ? await renderSegmentsWithOpenAi(rawSegments)
      : await renderSegmentsWithSay(rawSegments);

  await writeFile(outputSrt, buildSubtitleFile(rawSegments));
  await writeFile(outputScript, buildScriptFile(rawSegments, provider));
  await renderSubtitleCards();
  await buildNarrationAudio(videoDuration, renderedSegments);
  await renderFinalVideo(renderedSegments);

  await rm(tmpDir, { recursive: true, force: true });

  console.log(`Saved narration script to ${outputScript}`);
  console.log(`Saved Japanese subtitles to ${outputSrt}`);
  console.log(`Saved narrated demo to ${outputVideo}`);
}

await main();

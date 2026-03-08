import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const webappRoot = path.join(projectRoot, "webapp");
const demoDir = path.join(projectRoot, "demo");
const outputPath = path.join(demoDir, "ai_weekly_brief_demo.mp4");
const baseUrl = "http://127.0.0.1:3000";
const chromeExecutable =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: options.stdio ?? "inherit",
      cwd: options.cwd,
      env: {
        ...process.env,
        ...options.env,
      },
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

async function waitForServer(url, timeoutMs = 45_000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Retry until the server is ready.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function pause(page, ms) {
  await page.waitForTimeout(ms);
}

async function smoothScroll(page, distance, step = 120, wait = 160) {
  const totalSteps = Math.max(1, Math.ceil(distance / step));

  for (let index = 0; index < totalSteps; index += 1) {
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(wait);
  }
}

async function runWalkthrough(page) {
  await page.goto(`${baseUrl}/home`, { waitUntil: "networkidle" });
  await pause(page, 4600);
  await smoothScroll(page, 1050, 90, 190);
  await pause(page, 4200);
  await page.mouse.wheel(0, -1100);
  await pause(page, 3200);

  await page.getByRole("link", { name: "Updates", exact: true }).click();
  await page.waitForURL(`${baseUrl}/updates`);
  await pause(page, 4400);
  await page.getByPlaceholder("Search title, source, capability, or use case").fill(
    "excel",
  );
  await pause(page, 2800);
  await page
    .getByRole("button", {
      name: /ChatGPT for Excel and New Financial Data Integrations/i,
    })
    .first()
    .click();
  await pause(page, 6200);
  await page.getByPlaceholder("Search title, source, capability, or use case").fill("");
  await pause(page, 1600);
  await page.getByRole("button", { name: "Research", exact: true }).click();
  await pause(page, 2400);
  await page.getByRole("button", { name: /Codex Security/i }).first().click();
  await pause(page, 5200);

  await page.getByRole("link", { name: "Insights", exact: true }).click();
  await page.waitForURL(`${baseUrl}/insights`);
  await pause(page, 4200);
  await smoothScroll(page, 1550, 100, 200);
  await pause(page, 3400);
  await page.mouse.wheel(0, -1600);
  await pause(page, 2600);

  await page.getByRole("link", { name: "Use Cases", exact: true }).click();
  await page.waitForURL(`${baseUrl}/use-cases`);
  await pause(page, 4200);
  await smoothScroll(page, 2100, 95, 180);
  await pause(page, 4200);
  await page.mouse.wheel(0, -2200);
  await pause(page, 2600);

  await page.getByRole("link", { name: "Home", exact: true }).click();
  await page.waitForURL(`${baseUrl}/home`);
  await pause(page, 6200);
}

async function main() {
  if (!existsSync(chromeExecutable)) {
    throw new Error(`Google Chrome was not found at ${chromeExecutable}`);
  }

  await mkdir(demoDir, { recursive: true });
  const videoDir = await mkdtemp(path.join(tmpdir(), "ai-weekly-intel-video-"));

  const server = spawn("npm", ["run", "start", "--", "--hostname", "127.0.0.1", "--port", "3000"], {
    cwd: webappRoot,
    env: process.env,
    stdio: "inherit",
  });

  const cleanup = async () => {
    if (!server.killed) {
      server.kill("SIGTERM");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (!server.killed) {
        server.kill("SIGKILL");
      }
    }
    await rm(videoDir, { recursive: true, force: true });
  };

  try {
    await waitForServer(baseUrl);

    const browser = await chromium.launch({
      headless: true,
      executablePath: chromeExecutable,
      args: ["--disable-dev-shm-usage"],
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      screen: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
      recordVideo: {
        dir: videoDir,
        size: { width: 1920, height: 1080 },
      },
    });

    const page = await context.newPage();
    page.setDefaultTimeout(30_000);

    await runWalkthrough(page);

    const video = page.video();
    await context.close();
    await browser.close();

    if (!video) {
      throw new Error("Playwright did not produce a video file.");
    }

    const webmPath = await video.path();

    await runCommand("ffmpeg", [
      "-y",
      "-i",
      webmPath,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-an",
      outputPath,
    ]);
  } finally {
    await cleanup();
  }

  console.log(`Saved demo video to ${outputPath}`);
}

await main();

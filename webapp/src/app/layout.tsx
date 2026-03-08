import type { Metadata } from "next";

import { DashboardShell } from "@/components/dashboard-shell";
import { getUpdatesPayload } from "@/lib/intel";

import "./globals.css";

export const metadata: Metadata = {
  title: "OpenAI Weekly Brief",
  description:
    "Internal intelligence dashboard for recent OpenAI product, platform, research, and safety updates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const updates = getUpdatesPayload();

  return (
    <html lang="en">
      <body className="antialiased">
        <DashboardShell
          stats={{
            totalUpdates: updates.summary.total_updates,
            weekRange: `${updates.window.start} to ${updates.window.end}`,
          }}
        >
          {children}
        </DashboardShell>
      </body>
    </html>
  );
}

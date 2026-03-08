import { UpdatesExplorer } from "@/components/updates-explorer";
import { getUpdatesPayload } from "@/lib/intel";

export default function UpdatesPage() {
  const updates = getUpdatesPayload();

  return <UpdatesExplorer items={updates.items} />;
}

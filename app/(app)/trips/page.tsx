import { redirect } from "next/navigation";
import { TripPlanner } from "@/components/trips/TripPlanner";
import { getCurrentProfile } from "@/lib/profile/server";
import { loadCardDatabase } from "@/lib/data/loader";

export default async function TripsPage() {
  let profile;
  try {
    profile = await getCurrentProfile();
  } catch {
    redirect("/login");
  }
  const db = loadCardDatabase();
  return (
    <TripPlanner
      initialProfile={profile}
      cards={db.cards}
      programs={db.programs}
      destinationPerks={db.destinationPerks}
    />
  );
}

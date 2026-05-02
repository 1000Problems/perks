import { redirect } from "next/navigation";
import { TripPlanner } from "@/components/trips/TripPlanner";
import { getCurrentProfile } from "@/lib/profile/server";
import { loadCardDatabase } from "@/lib/data/loader";
import { toSerialized } from "@/lib/data/serialized";

export default async function TripsPage() {
  let profile;
  try {
    profile = await getCurrentProfile();
  } catch {
    redirect("/login");
  }
  const db = loadCardDatabase();
  return <TripPlanner initialProfile={profile} serializedDb={toSerialized(db)} />;
}

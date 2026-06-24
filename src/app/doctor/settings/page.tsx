import db from "@/lib/db";
import DoctorSettingsClient from "@/components/doctor-settings-client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  // Query Dr. Sarah's doctor profile
  const doctor = db.doctors.findUnique({ where: { id: "doctor-sarah" } });
  
  if (!doctor) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-accent to-accent bg-clip-text text-transparent">
          AI Scribe Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure clinical preferences and dictate note-writing models (Doctor Personal AI Memory).
        </p>
      </div>

      {/* Settings management client panel */}
      <DoctorSettingsClient doctor={doctor} />
    </div>
  );
}

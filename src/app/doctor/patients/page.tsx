import db from "@/lib/db";
import PatientListClient from "@/components/patient-list-client";

export const dynamic = "force-dynamic";

export default function PatientsPage() {
  // Query all patients registered under the clinic/doctor
  const patients = db.patients.findMany();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-accent to-accent bg-clip-text text-transparent">
          Patient Directory
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Search patient profiles, view clinical histories, timelines, and draft referral letters.
        </p>
      </div>

      {/* Interactive client side directory */}
      <PatientListClient initialPatients={patients} />
    </div>
  );
}

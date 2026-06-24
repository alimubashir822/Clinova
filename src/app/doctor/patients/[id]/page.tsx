import db from "@/lib/db";
import PatientDetailClient from "@/components/patient-detail-client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PatientPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientDetailPage({ params }: PatientPageProps) {
  // Await params promise for Next.js 15/16 compatibility
  const resolvedParams = await params;
  const patientId = resolvedParams.id;

  // Retrieve patient
  const patient = db.patients.findUnique({ where: { id: patientId } });
  if (!patient) {
    notFound();
  }

  // Retrieve patient's encounters
  const encounters = db.encounters.findMany({
    where: { patientId: patientId },
  }).sort((a, b) => b.date.localeCompare(a.date)); // Sort chronologically (newest first)

  // Retrieve clinical notes for all encounters
  const allNotes = db.clinicalNotes.findMany();
  const notes = allNotes.filter((n) => 
    encounters.some((e) => e.id === n.encounterId)
  );

  // Retrieve reports for the patient
  const reports = db.reports.findMany({
    where: { patientId: patientId }
  });

  return (
    <div className="space-y-6">
      <PatientDetailClient 
        patient={patient} 
        encounters={encounters} 
        notes={notes} 
        reports={reports} 
      />
    </div>
  );
}

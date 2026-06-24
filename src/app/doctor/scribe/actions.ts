"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface SaveEncounterInput {
  patientId: string;
  transcript: string;
  specialty: string;
  noteType: "SOAP" | "PROGRESS" | "CONSULTATION" | "DISCHARGE" | "REFERRAL";
  noteContent: string; // JSON stringified content
  qualityScore: number;
  qualityFeedback: string; // JSON stringified feedback
  durationSec: number;
}

export async function saveEncounterAction(input: SaveEncounterInput) {
  try {
    const doctorId = "doctor-sarah"; // Simulated logged-in doctor
    const doctorUser = db.users.findUnique({ where: { id: "user-sarah" } });

    // 1. Create Encounter record
    const encounter = db.encounters.create({
      data: {
        patientId: input.patientId,
        doctorId: doctorId,
        date: new Date().toISOString(),
        transcript: input.transcript,
        status: "COMPLETED",
      },
    });

    // 2. Create VoiceRecord link
    db.voiceRecords.create({
      data: {
        encounterId: encounter.id,
        durationSec: input.durationSec,
        fileUrl: `/audio/${encounter.id}.mp3`,
      },
    });

    // 3. Create ClinicalNote entry
    db.clinicalNotes.create({
      data: {
        encounterId: encounter.id,
        type: input.noteType,
        content: input.noteContent,
        qualityScore: input.qualityScore,
        qualityFeedback: input.qualityFeedback,
      },
    });

    // 4. Update doctor AI minutes used count
    const minutesUsed = Math.ceil(input.durationSec / 60);
    const doctor = db.doctors.findUnique({ where: { id: doctorId } });
    if (doctor) {
      db.doctors.update({
        where: { id: doctorId },
        data: { aiUsageMinutes: doctor.aiUsageMinutes + minutesUsed },
      });
    }

    // 5. Create AuditLog entry
    db.auditLogs.create({
      data: {
        userId: doctorUser?.id || "user-sarah",
        action: "Generate Clinical Note",
        details: `Generated ${input.noteType} note for patient ID: ${input.patientId} (Encounter ID: ${encounter.id}). Quality Score: ${input.qualityScore}%.`,
      },
    });

    // Revalidate the dashboard and patient page lists
    revalidatePath("/doctor/dashboard");
    revalidatePath("/doctor/patients");
    revalidatePath(`/doctor/patients/${input.patientId}`);
    revalidatePath("/admin");

    return { success: true, encounterId: encounter.id };
  } catch (error: any) {
    console.error("Failed to save encounter:", error);
    return { success: false, error: error.message || "Failed to save encounter" };
  }
}

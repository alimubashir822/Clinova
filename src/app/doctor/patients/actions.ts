"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updatePatientHistoryAction(patientId: string, history: string) {
  try {
    const doctorUserId = "user-sarah"; // Simulated logged in doctor
    
    db.patients.update({
      where: { id: patientId },
      data: { medicalHistory: history },
    });

    db.auditLogs.create({
      data: {
        userId: doctorUserId,
        action: "Update Patient History",
        details: `Updated medical history for patient ID: ${patientId}.`,
      },
    });

    revalidatePath(`/doctor/patients/${patientId}`);
    revalidatePath("/doctor/dashboard");
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update patient history:", error);
    return { success: false, error: error.message };
  }
}

export async function createPatientReportAction(
  patientId: string, 
  title: string, 
  type: "LAB_SUMMARY" | "VISIT_SUMMARY" | "REFERRAL_REPORT" | "PATIENT_INSTRUCTIONS", 
  content: string
) {
  try {
    const doctorUserId = "user-sarah";
    
    const report = db.reports.create({
      data: {
        patientId,
        title,
        type,
        content,
      },
    });

    db.auditLogs.create({
      data: {
        userId: doctorUserId,
        action: "Generate AI Report",
        details: `Generated report of type ${type} ("${title}") for patient ID: ${patientId}.`,
      },
    });

    revalidatePath(`/doctor/patients/${patientId}`);
    revalidatePath("/doctor/reports");
    
    return { success: true, reportId: report.id };
  } catch (error: any) {
    console.error("Failed to create report:", error);
    return { success: false, error: error.message };
  }
}

export async function updateDoctorPreferencesAction(preferencesJson: string) {
  try {
    const doctorId = "doctor-sarah";
    const doctorUserId = "user-sarah";

    db.doctors.update({
      where: { id: doctorId },
      data: { preferences: preferencesJson },
    });

    db.auditLogs.create({
      data: {
        userId: doctorUserId,
        action: "Update AI Preferences",
        details: "Doctor updated personal AI memory and documentation style preferences.",
      },
    });

    revalidatePath("/doctor/settings");
    revalidatePath("/doctor/dashboard");
    revalidatePath("/doctor/scribe");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update doctor preferences:", error);
    return { success: false, error: error.message };
  }
}

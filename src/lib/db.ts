import fs from "fs";
import path from "path";

// Define TypeScript interfaces for our models (similar to Prisma Client types)
export interface User {
  id: string;
  email: string;
  name: string;
  role: "DOCTOR" | "ADMIN" | "ASSISTANT" | "PATIENT";
  organizationId?: string | null;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  userId: string;
  specialty: string;
  preferences: string; // JSON stringified preferences
  aiUsageMinutes: number;
}

export interface Patient {
  id: string;
  userId?: string | null;
  name: string;
  dob: string;
  gender: string;
  phone?: string | null;
  medicalHistory?: string | null;
  doctorId: string;
  createdAt: string;
}

export interface Encounter {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  transcript: string;
  status: "COMPLETED" | "PENDING";
  createdAt: string;
}

export interface VoiceRecord {
  id: string;
  encounterId: string;
  durationSec: number;
  fileUrl?: string | null;
  createdAt: string;
}

export interface ClinicalNote {
  id: string;
  encounterId: string;
  type: "SOAP" | "PROGRESS" | "CONSULTATION" | "DISCHARGE" | "REFERRAL";
  content: string; // JSON stringified structure
  qualityScore: number;
  qualityFeedback?: string | null; // JSON stringified suggestions
  createdAt: string;
}

export interface Template {
  id: string;
  doctorId?: string | null;
  name: string;
  specialty: string;
  structure: string; // JSON stringified structure
  isSystem: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  patientId: string;
  type: "LAB_SUMMARY" | "VISIT_SUMMARY" | "REFERRAL_REPORT" | "PATIENT_INSTRUCTIONS";
  title: string;
  content: string;
  createdAt: string;
}

export interface Document {
  id: string;
  patientId: string;
  name: string;
  category: string;
  fileUrl?: string | null;
  content?: string | null;
  createdAt: string;
}

export interface Message {
  id: string;
  patientId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface DatabaseState {
  users: User[];
  organizations: Organization[];
  doctors: Doctor[];
  patients: Patient[];
  encounters: Encounter[];
  voiceRecords: VoiceRecord[];
  clinicalNotes: ClinicalNote[];
  templates: Template[];
  reports: Report[];
  documents: Document[];
  messages: Message[];
  auditLogs: AuditLog[];
}

const DB_FILE_PATH = path.join(process.cwd(), "prisma", "db.json");

// Helper function to seed initial data
function getSeedData(): DatabaseState {
  const doctorUserId = "user-sarah";
  const doctorId = "doctor-sarah";
  const orgId = "org-clinova";

  const users: User[] = [
    {
      id: doctorUserId,
      email: "sarah.jenkins@clinova.ai",
      name: "Dr. Sarah Jenkins",
      role: "DOCTOR",
      organizationId: orgId,
      createdAt: "2025-01-10T08:00:00.000Z",
    },
    {
      id: "user-admin",
      email: "admin@clinova.ai",
      name: "Clinova Admin",
      role: "ADMIN",
      organizationId: orgId,
      createdAt: "2025-01-01T08:00:00.000Z",
    },
  ];

  const organizations: Organization[] = [
    {
      id: orgId,
      name: "Clinova Health Network",
      createdAt: "2025-01-01T08:00:00.000Z",
    },
  ];

  const doctors: Doctor[] = [
    {
      id: doctorId,
      userId: doctorUserId,
      specialty: "General Medicine / Cardiology",
      preferences: JSON.stringify({
        noteStyle: "short", // "short" | "standard" | "detailed"
        showReviewAIPrompt: true,
        autoSave: true,
      }),
      aiUsageMinutes: 142,
    },
  ];

  const patients: Patient[] = [
    {
      id: "patient-1",
      name: "John Doe",
      dob: "1981-04-12T00:00:00.000Z",
      gender: "Male",
      phone: "+1 (555) 123-4567",
      medicalHistory: "Hypertension, Hyperlipidemia. No known drug allergies.",
      doctorId: doctorId,
      createdAt: "2025-01-12T09:00:00.000Z",
    },
    {
      id: "patient-2",
      name: "Emily Chen",
      dob: "1998-09-22T00:00:00.000Z",
      gender: "Female",
      phone: "+1 (555) 987-6543",
      medicalHistory: "Mild asthma, seasonal allergic rhinitis.",
      doctorId: doctorId,
      createdAt: "2025-02-05T10:00:00.000Z",
    },
    {
      id: "patient-3",
      name: "Marcus Thompson",
      dob: "1959-11-05T00:00:00.000Z",
      gender: "Male",
      phone: "+1 (555) 456-7890",
      medicalHistory: "Type 2 Diabetes (diet controlled), Osteoarthritis of both knees. Penicillin allergy (causes hives).",
      doctorId: doctorId,
      createdAt: "2025-03-01T11:00:00.000Z",
    },
  ];

  // John Doe Encounters
  const encounters: Encounter[] = [
    {
      id: "encounter-1",
      patientId: "patient-1",
      doctorId: doctorId,
      date: "2025-01-15T10:00:00.000Z",
      transcript: "Doctor: Welcome back John. How are your readings? Patient: Hi doctor, I have been checking my blood pressure at home. It averages around 135 over 85. Doctor: Okay, that is pretty stable, but we want to make sure it stays under 130/80. Any side effects from the Lisinopril? Patient: Just a dry cough occasionally, but it is not too bad. Doctor: Let's monitor that cough. If it gets worse, we might switch you to an ARB. Continue Lisinopril 10mg daily. Let's meet again in 3 months.",
      status: "COMPLETED",
      createdAt: "2025-01-15T10:30:00.000Z",
    },
    {
      id: "encounter-2",
      patientId: "patient-1",
      doctorId: doctorId,
      date: "2025-04-18T10:00:00.000Z",
      transcript: "Doctor: Hi John. How is the BP and the cough? Patient: The cough went away mostly. BP readings are averaging 128 over 78. Doctor: Excellent, that's exactly where we want it. Your lipid panel from last week showed cholesterol of 210, LDL 130. We should start low-dose Atorvastatin to manage that. Let's do 10mg at night. Patient: Okay, sounds good. Doctor: Keep up the low-sodium diet and daily walking.",
      status: "COMPLETED",
      createdAt: "2025-04-18T10:45:00.000Z",
    },
    {
      id: "encounter-3",
      patientId: "patient-1",
      doctorId: doctorId,
      date: "2026-06-24T10:00:00.000Z",
      transcript: "Doctor: Welcome back John. Any new concerns today? Patient: Well, doctor, I've had some mild chest pain for the last three days. It happens when I climb the stairs. It goes away after I rest for a few minutes. Doctor: That is very important. Is it a sharp pain or more like a pressure/heaviness? Patient: More like a heavy squeezing feeling in the center of my chest. No pain down my arm or neck. Doctor: Any shortness of breath, sweating, or nausea? Patient: A little short of breath, yes. No sweating. Doctor: We need to evaluate this right away. I'm going to perform an EKG now, and I will refer you to Cardiology for a stress test and further evaluation. I also want you to take an Aspirin 81mg daily starting today. If you experience crushing chest pain, pain radiating to your jaw or arm, sweating or severe shortness of breath, you must call 911 immediately. Patient: Understood, doctor.",
      status: "PENDING", // PENDING Review in dashboard!
      createdAt: "2026-06-24T10:20:00.000Z",
    },
  ];

  const voiceRecords: VoiceRecord[] = [
    {
      id: "voice-1",
      encounterId: "encounter-3",
      durationSec: 154,
      fileUrl: "/audio/encounter-3.mp3",
      createdAt: "2026-06-24T10:20:00.000Z",
    },
  ];

  const clinicalNotes: ClinicalNote[] = [
    {
      id: "note-1",
      encounterId: "encounter-1",
      type: "SOAP",
      content: JSON.stringify({
        subjective: "Patient returns for blood pressure monitoring. Reports home blood pressure readings averaging 135/85. Complains of mild, intermittent dry cough, which he associates with Lisinopril. Denies chest pain, shortness of breath, or palpitations.",
        objective: "Vital signs: BP 136/84 mmHg, HR 72 bpm, Temp 98.4 F. Cardiovascular: Regular rate and rhythm, normal S1/S2, no murmurs. Lungs: Clear to auscultation bilaterally.",
        assessment: "1. Essential Hypertension - stable on Lisinopril but BP is slightly above target (<130/80).\n2. Mild dry cough - likely secondary to ACE inhibitor.",
        plan: "1. Continue Lisinopril 10mg daily.\n2. Monitor dry cough. If it becomes intolerable, consider transition to Losartan (ARB).\n3. Re-evaluate blood pressure in 3 months.\n4. Counseled on low-sodium diet and exercise.",
      }),
      qualityScore: 95,
      qualityFeedback: JSON.stringify({
        warnings: [],
        suggestions: ["Add home cuff calibration reminder."],
      }),
      createdAt: "2025-01-15T10:30:00.000Z",
    },
    {
      id: "note-2",
      encounterId: "encounter-2",
      type: "SOAP",
      content: JSON.stringify({
        subjective: "Patient reports home BP readings are now excellent, averaging 128/78. Notes that the dry cough previously experienced has resolved. Denies chest pain or shortness of breath. Active lifestyle maintained.",
        objective: "BP: 126/78 mmHg, HR 68 bpm. Heart: Normal sinus rhythm. Lungs: Clear. Lab review: Total Cholesterol 210 mg/dL, LDL-C 130 mg/dL.",
        assessment: "1. Hypertension - well controlled on Lisinopril.\n2. Hyperlipidemia - LDL elevated at 130, CV risk assessment warrants statin therapy.",
        plan: "1. Continue Lisinopril 10mg daily.\n2. Initiate Atorvastatin 10mg tablet once daily at bedtime.\n3. Check fasting lipid profile and liver function tests in 8-12 weeks.\n4. Emphasized cardiovascular exercise and low-fat, low-cholesterol diet.",
      }),
      qualityScore: 98,
      qualityFeedback: JSON.stringify({
        warnings: [],
        suggestions: [],
      }),
      createdAt: "2025-04-18T10:45:00.000Z",
    },
  ];

  const templates: Template[] = [
    {
      id: "template-cardiology",
      name: "Cardiology Assessment",
      specialty: "Cardiology",
      structure: JSON.stringify({
        fields: [
          { name: "Chief Complaint", id: "cc", placeholder: "e.g., Chest pain, palpitations" },
          { name: "History of Present Illness (HPI)", id: "hpi", placeholder: "Duration, radiation, aggravating factors" },
          { name: "Cardiac Risk Factors", id: "risk_factors", placeholder: "HTN, lipids, smoking, family history" },
          { name: "Cardiovascular Exam", id: "exam", placeholder: "Murmurs, rubs, gallops, pulses, edema" },
          { name: "Diagnostics (EKG/Echo)", id: "diagnostics", placeholder: "Rhythm, ST changes, EF" },
          { name: "Management Plan", id: "plan", placeholder: "Meds, referrals, warning signs" },
        ],
      }),
      isSystem: true,
      createdAt: "2025-01-01T00:00:00.000Z",
    },
    {
      id: "template-pediatrics",
      name: "Pediatric Well-Child Visit",
      specialty: "Pediatrics",
      structure: JSON.stringify({
        fields: [
          { name: "Growth Metrics & Percentiles", id: "growth", placeholder: "Height, weight, head circumference" },
          { name: "Developmental Milestones", id: "milestones", placeholder: "Motor, language, social benchmarks" },
          { name: "Nutrition & Sleep", id: "nutrition", placeholder: "Diet, screen time, sleep schedule" },
          { name: "Immunizations", id: "vax", placeholder: "Vaccines administered today or due" },
          { name: "Anticipatory Guidance", id: "guidance", placeholder: "Safety, behavior, family support advice" },
        ],
      }),
      isSystem: true,
      createdAt: "2025-01-01T00:00:00.000Z",
    },
    {
      id: "template-dermatology",
      name: "Dermatological Exam",
      specialty: "Dermatology",
      structure: JSON.stringify({
        fields: [
          { name: "Lesion Description", id: "description", placeholder: "Size, color, borders, symmetry, location" },
          { name: "Symptoms", id: "symptoms", placeholder: "Pruritus, bleeding, rapid change, pain" },
          { name: "Biopsy details (if applicable)", id: "biopsy", placeholder: "Site, technique, pathology order" },
          { name: "Sun Protection Counseling", id: "sun_counseling", placeholder: "SPF, protective wear, skin checks" },
        ],
      }),
      isSystem: true,
      createdAt: "2025-01-01T00:00:00.000Z",
    },
    {
      id: "template-dental",
      name: "Dental Routine Exam",
      specialty: "Dental",
      structure: JSON.stringify({
        fields: [
          { name: "Oral Hygiene Status", id: "hygiene", placeholder: "Plaque score, calculus levels" },
          { name: "Periodontal Health", id: "periodontal", placeholder: "Pocket depths, gingivitis score" },
          { name: "Hard Tissue Findings", id: "caries", placeholder: "Caries, restorations, fractures" },
          { name: "Radiographic Review", id: "xray", placeholder: "Bitewings, periapicals findings" },
          { name: "Treatment Plan", id: "plan", placeholder: "Fillings, hygiene visits, ortho" },
        ],
      }),
      isSystem: true,
      createdAt: "2025-01-01T00:00:00.000Z",
    },
    {
      id: "template-general",
      name: "General SOAP Note",
      specialty: "General Medicine",
      structure: JSON.stringify({
        fields: [
          { name: "Subjective", id: "s", placeholder: "Patient reports symptoms, history, lifestyle" },
          { name: "Objective", id: "o", placeholder: "Physical exam, vitals, labs, diagnostics" },
          { name: "Assessment", id: "a", placeholder: "Differential diagnosis, clinical reasoning" },
          { name: "Plan", id: "p", placeholder: "Therapeutics, medications, education, follow-up" },
        ],
      }),
      isSystem: true,
      createdAt: "2025-01-01T00:00:00.000Z",
    },
  ];

  const reports: Report[] = [
    {
      id: "report-1",
      patientId: "patient-1",
      type: "VISIT_SUMMARY",
      title: "Patient Visit Summary - Jan 15, 2025",
      content: "Thank you for coming in today, John. We reviewed your blood pressure, which is currently stable at 136/84. We want to keep it under 130/80, so please continue taking your Lisinopril 10mg daily as prescribed. We discussed the dry cough you've been having. It's a common side effect of Lisinopril, so let's keep an eye on it. If it gets worse, we'll switch you to another medication. We look forward to seeing you in 3 months.",
      createdAt: "2025-01-15T11:00:00.000Z",
    },
    {
      id: "report-2",
      patientId: "patient-1",
      type: "VISIT_SUMMARY",
      title: "Patient Visit Summary - Apr 18, 2025",
      content: "John, congratulations on bringing your average blood pressure down to 128/78. The cough you reported has also cleared up. To help manage your LDL cholesterol levels, which were slightly high at 130, I have prescribed a low-dose cholesterol medication called Atorvastatin (10mg). Please take this once daily at night. Remember to continue walking daily and limit salt in your meals. We'll run a follow-up lipid test in about 2 months.",
      createdAt: "2025-04-18T11:15:00.000Z",
    },
  ];

  const documents: Document[] = [
    {
      id: "doc-1",
      patientId: "patient-1",
      name: "Lipid Panel Results - April 2025",
      category: "Lab Results",
      content: "Lipid Panel: Total Cholesterol: 210 mg/dL (High). Triglycerides: 140 mg/dL (Normal). HDL: 45 mg/dL (Normal). LDL-C calculated: 130 mg/dL (High). Borderline cardiovascular risk.",
      createdAt: "2025-04-12T08:00:00.000Z",
    },
  ];

  const messages: Message[] = [
    {
      id: "msg-1",
      patientId: "patient-1",
      senderId: "doctor-sarah",
      content: "Hi John, I've sent your new visit summary and your cholesterol prescription. Please check them, and let me know if you have any questions.",
      createdAt: "2025-04-18T11:30:00.000Z",
    },
  ];

  const auditLogs: AuditLog[] = [
    {
      id: "audit-1",
      userId: doctorUserId,
      action: "Log In",
      details: "Dr. Sarah Jenkins logged in successfully.",
      timestamp: "2026-06-24T08:30:00.000Z",
    },
    {
      id: "audit-2",
      userId: doctorUserId,
      action: "Create Encounter",
      details: "Created new pending encounter for Patient: John Doe.",
      timestamp: "2026-06-24T10:20:00.000Z",
    },
  ];

  return {
    users,
    organizations,
    doctors,
    patients,
    encounters,
    voiceRecords,
    clinicalNotes,
    templates,
    reports,
    documents,
    messages,
    auditLogs,
  };
}

// Database helper class managing IO
class FileDatabase {
  private state: DatabaseState | null = null;

  private init() {
    if (this.state) return;

    // Check if folder exists
    const prismaDir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(prismaDir)) {
      fs.mkdirSync(prismaDir, { recursive: true });
    }

    if (fs.existsSync(DB_FILE_PATH)) {
      try {
        const raw = fs.readFileSync(DB_FILE_PATH, "utf8");
        this.state = JSON.parse(raw);
        return;
      } catch (err) {
        console.error("Failed to read database. Resetting to seed data.", err);
      }
    }

    // Seed data
    const seed = getSeedData();
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(seed, null, 2), "utf8");
    this.state = seed;
  }

  private save() {
    if (!this.state) return;
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.state, null, 2), "utf8");
  }

  get users() {
    this.init();
    return {
      findMany: () => this.state!.users,
      findUnique: (args: { where: { id: string } }) =>
        this.state!.users.find((u) => u.id === args.where.id) || null,
      create: (args: { data: Omit<User, "id" | "createdAt"> }) => {
        const newUser: User = {
          ...args.data,
          id: `user-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        this.state!.users.push(newUser);
        this.save();
        return newUser;
      },
    };
  }

  get organizations() {
    this.init();
    return {
      findMany: () => this.state!.organizations,
      findUnique: (args: { where: { id: string } }) =>
        this.state!.organizations.find((o) => o.id === args.where.id) || null,
      create: (args: { data: { name: string } }) => {
        const newOrg: Organization = {
          id: `org-${Math.random().toString(36).substr(2, 9)}`,
          name: args.data.name,
          createdAt: new Date().toISOString(),
        };
        this.state!.organizations.push(newOrg);
        this.save();
        return newOrg;
      },
    };
  }

  get doctors() {
    this.init();
    return {
      findMany: () => this.state!.doctors,
      findUnique: (args: { where: { id?: string; userId?: string } }) => {
        this.init();
        if (args.where.id) {
          return this.state!.doctors.find((d) => d.id === args.where.id) || null;
        }
        if (args.where.userId) {
          return this.state!.doctors.find((d) => d.userId === args.where.userId) || null;
        }
        return null;
      },
      update: (args: { where: { id: string }; data: Partial<Omit<Doctor, "id">> }) => {
        const idx = this.state!.doctors.findIndex((d) => d.id === args.where.id);
        if (idx === -1) throw new Error("Doctor not found");
        this.state!.doctors[idx] = {
          ...this.state!.doctors[idx],
          ...args.data,
        };
        this.save();
        return this.state!.doctors[idx];
      },
    };
  }

  get patients() {
    this.init();
    return {
      findMany: () => this.state!.patients,
      findUnique: (args: { where: { id: string } }) =>
        this.state!.patients.find((p) => p.id === args.where.id) || null,
      create: (args: { data: Omit<Patient, "id" | "createdAt"> }) => {
        const newPatient: Patient = {
          ...args.data,
          id: `patient-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        this.state!.patients.push(newPatient);
        this.save();
        return newPatient;
      },
      update: (args: { where: { id: string }; data: Partial<Omit<Patient, "id" | "createdAt">> }) => {
        const idx = this.state!.patients.findIndex((p) => p.id === args.where.id);
        if (idx === -1) throw new Error("Patient not found");
        this.state!.patients[idx] = {
          ...this.state!.patients[idx],
          ...args.data,
        };
        this.save();
        return this.state!.patients[idx];
      },
    };
  }

  get encounters() {
    this.init();
    return {
      findMany: (args?: { where?: { patientId?: string; doctorId?: string } }) => {
        let list = this.state!.encounters;
        if (args?.where?.patientId) {
          list = list.filter((e) => e.patientId === args.where!.patientId);
        }
        if (args?.where?.doctorId) {
          list = list.filter((e) => e.doctorId === args.where!.doctorId);
        }
        return list;
      },
      findUnique: (args: { where: { id: string } }) =>
        this.state!.encounters.find((e) => e.id === args.where.id) || null,
      create: (args: { data: Omit<Encounter, "id" | "createdAt"> }) => {
        const newEncounter: Encounter = {
          ...args.data,
          id: `encounter-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        this.state!.encounters.push(newEncounter);
        this.save();
        return newEncounter;
      },
      update: (args: { where: { id: string }; data: Partial<Omit<Encounter, "id" | "createdAt">> }) => {
        const idx = this.state!.encounters.findIndex((e) => e.id === args.where.id);
        if (idx === -1) throw new Error("Encounter not found");
        this.state!.encounters[idx] = {
          ...this.state!.encounters[idx],
          ...args.data,
        };
        this.save();
        return this.state!.encounters[idx];
      },
    };
  }

  get voiceRecords() {
    this.init();
    return {
      findMany: () => this.state!.voiceRecords,
      findUnique: (args: { where: { encounterId: string } }) =>
        this.state!.voiceRecords.find((v) => v.encounterId === args.where.encounterId) || null,
      create: (args: { data: Omit<VoiceRecord, "id" | "createdAt"> }) => {
        const newRecord: VoiceRecord = {
          ...args.data,
          id: `voice-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        this.state!.voiceRecords.push(newRecord);
        this.save();
        return newRecord;
      },
    };
  }

  get clinicalNotes() {
    this.init();
    return {
      findMany: (args?: { where?: { encounterId?: string } }) => {
        let list = this.state!.clinicalNotes;
        if (args?.where?.encounterId) {
          list = list.filter((n) => n.encounterId === args.where!.encounterId);
        }
        return list;
      },
      findUnique: (args: { where: { id: string } }) =>
        this.state!.clinicalNotes.find((n) => n.id === args.where.id) || null,
      create: (args: { data: Omit<ClinicalNote, "id" | "createdAt"> }) => {
        const newNote: ClinicalNote = {
          ...args.data,
          id: `note-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        this.state!.clinicalNotes.push(newNote);
        this.save();
        return newNote;
      },
      update: (args: { where: { id: string }; data: Partial<Omit<ClinicalNote, "id" | "createdAt">> }) => {
        const idx = this.state!.clinicalNotes.findIndex((n) => n.id === args.where.id);
        if (idx === -1) throw new Error("Clinical Note not found");
        this.state!.clinicalNotes[idx] = {
          ...this.state!.clinicalNotes[idx],
          ...args.data,
        };
        this.save();
        return this.state!.clinicalNotes[idx];
      },
    };
  }

  get templates() {
    this.init();
    return {
      findMany: (args?: { where?: { doctorId?: string } }) => {
        return this.state!.templates;
      },
      findUnique: (args: { where: { id: string } }) =>
        this.state!.templates.find((t) => t.id === args.where.id) || null,
      create: (args: { data: Omit<Template, "id" | "createdAt"> }) => {
        const newTemplate: Template = {
          ...args.data,
          id: `template-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        this.state!.templates.push(newTemplate);
        this.save();
        return newTemplate;
      },
    };
  }

  get reports() {
    this.init();
    return {
      findMany: (args?: { where?: { patientId?: string } }) => {
        let list = this.state!.reports;
        if (args?.where?.patientId) {
          list = list.filter((r) => r.patientId === args.where!.patientId);
        }
        return list;
      },
      findUnique: (args: { where: { id: string } }) =>
        this.state!.reports.find((r) => r.id === args.where.id) || null,
      create: (args: { data: Omit<Report, "id" | "createdAt"> }) => {
        const newReport: Report = {
          ...args.data,
          id: `report-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        this.state!.reports.push(newReport);
        this.save();
        return newReport;
      },
    };
  }

  get documents() {
    this.init();
    return {
      findMany: (args?: { where?: { patientId?: string } }) => {
        let list = this.state!.documents;
        if (args?.where?.patientId) {
          list = list.filter((d) => d.patientId === args.where!.patientId);
        }
        return list;
      },
      findUnique: (args: { where: { id: string } }) =>
        this.state!.documents.find((d) => d.id === args.where.id) || null,
      create: (args: { data: Omit<Document, "id" | "createdAt"> }) => {
        const newDoc: Document = {
          ...args.data,
          id: `doc-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        this.state!.documents.push(newDoc);
        this.save();
        return newDoc;
      },
    };
  }

  get messages() {
    this.init();
    return {
      findMany: (args?: { where?: { patientId?: string } }) => {
        let list = this.state!.messages;
        if (args?.where?.patientId) {
          list = list.filter((m) => m.patientId === args.where!.patientId);
        }
        return list;
      },
      create: (args: { data: Omit<Message, "id" | "createdAt"> }) => {
        const newMsg: Message = {
          ...args.data,
          id: `msg-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        this.state!.messages.push(newMsg);
        this.save();
        return newMsg;
      },
    };
  }

  get auditLogs() {
    this.init();
    return {
      findMany: () => this.state!.auditLogs.sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
      create: (args: { data: Omit<AuditLog, "id" | "timestamp"> }) => {
        const newLog: AuditLog = {
          ...args.data,
          id: `audit-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
        };
        this.state!.auditLogs.push(newLog);
        this.save();
        return newLog;
      },
    };
  }
}

export const db = new FileDatabase();
export default db;

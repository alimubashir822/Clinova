"use client";

import { useState, useEffect, useRef } from "react";
import { Patient, Encounter, ClinicalNote, Report } from "@/lib/db";
import { updatePatientHistoryAction, createPatientReportAction } from "@/app/doctor/patients/actions";
import { saveEncounterAction } from "@/app/doctor/scribe/actions";
import Waveform from "@/components/ui/waveform";
import ScoreRing from "@/components/ui/score-ring";
import { SCENARIOS } from "@/lib/scribe-scenarios";
import { 
  User, 
  Calendar, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Activity, 
  Edit3, 
  Check, 
  Plus, 
  ChevronRight, 
  FileText, 
  Brain, 
  AlertCircle,
  Share2,
  Search,
  Sparkles,
  Heart,
  TrendingUp,
  Bookmark,
  CalendarDays,
  FileCheck,
  Volume2,
  Mic,
  Square,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Upload,
  Eye,
  FileDown
} from "lucide-react";

interface PatientDetailClientProps {
  patient: Patient;
  encounters: Encounter[];
  notes: ClinicalNote[];
  reports: Report[];
}

// AI Clinical Copilot Brief definitions
const CLINICAL_BRIEFS: Record<string, { history: string; lastVisit: string; focus: string; questions: string[] }> = {
  "patient-1": {
    history: "Essential Hypertension, Hyperlipidemia. Sulfa drug allergy.",
    lastVisit: "Blood pressure stabilized (128/78). Initiated Atorvastatin 10mg daily at bedtime for elevated LDL (130).",
    focus: "Assess new exertional chest squeezing and coordinate cardiology diagnostic workup.",
    questions: [
      "Ask about chest pain triggers (stairs, workouts) and duration to rest relief.",
      "Check daily Aspirin 81mg tolerability.",
      "Verify home blood pressure readings consistency.",
      "Confirm family history of early coronary artery disease."
    ]
  },
  "patient-2": {
    history: "Mild persistent asthma, seasonal allergic rhinitis.",
    lastVisit: "Well-child checkup. Prescribed Albuterol spacer refilled. No acute wheezing.",
    focus: "Evaluate nocturnal cough and assess expiratory wheezing triggers.",
    questions: [
      "Review SABA (Albuterol) usage frequency over past week.",
      "Assess home sleep disturbances due to coughing.",
      "Update pediatric asthma action plan copy."
    ]
  },
  "patient-3": {
    history: "Type 2 Diabetes (diet controlled), severe bilateral knee Osteoarthritis.",
    lastVisit: "A1c check (6.1%, stable). Initiated physical therapy referral for knee mobility.",
    focus: "Evaluate molar cavity progression and coordinate dental composite restoration.",
    questions: [
      "Confirm active anticoagulants use due to bleeding gums risk.",
      "Check patient comfort with local dental anesthetics.",
      "Verify daily brushing and flossing frequency."
    ]
  }
};

// AI Patient Story Journey definitions
const PATIENT_JOURNEYS: Record<string, { year: string; title: string; desc: string; icon: string }[]> = {
  "patient-1": [
    { year: "2024", title: "Hypertension Diagnosed", desc: "Presented with elevated BP (148/92). Initiated Lisinopril 10mg once daily.", icon: "🩺" },
    { year: "2025", title: "Cholesterol Rise & Statin", desc: "Dry cough resolved. BP stable. Lipid check showed high LDL (130). Started Atorvastatin 10mg.", icon: "💊" },
    { year: "2026", title: "Exertional Angina Suspected", desc: "Reported central chest squeezing on exertion. Office EKG normal. Placed urgent Cardiology referral.", icon: "❤️" }
  ],
  "patient-2": [
    { year: "2024", title: "Pediatric Asthma Profiling", desc: "Diagnosed with mild persistent asthma. Issued Albuterol spacer.", icon: "🌬️" },
    { year: "2025", title: "Allergic Rhinitis Management", desc: "Runny nose and seasonal flares controlled with Fluticasone spray.", icon: "👃" },
    { year: "2026", title: "Acute Exacerbation Treatment", desc: "Diffuse expiratory wheezing on exam. Started 5-day oral Prednisolone steroid syrup.", icon: "📈" }
  ],
  "patient-3": [
    { year: "2024", title: "Type 2 Diabetes Screening", desc: "Borderline HbA1c (6.3%). Initiated dietary modification and lifestyle plans.", icon: "🍎" },
    { year: "2025", title: "Joint Mobility Limitation", desc: "Chronic knee pain diagnosed as bilateral osteoarthritis. Initiated PT.", icon: "🦿" },
    { year: "2026", title: "Occlusal Molar Decay Check", desc: "Shallow caries found on tooth #14. Composite filling scheduled.", icon: "🦷" }
  ]
};

// Mock Document Listing for Analyzer
const ANALYZER_DOCUMENTS = [
  { id: "doc-cbc", name: "CBC Lab Panel Results.pdf", date: "April 12, 2025", category: "Lab Report" },
  { id: "doc-cardio", name: "Cardiology Stress Test Scan.pdf", date: "April 20, 2025", category: "Diagnostics" },
  { id: "doc-biopsy", name: "Dermatological Lesion Biopsy.pdf", date: "May 02, 2025", category: "Pathology" }
];

const ANALYZER_REPORTS: Record<string, { summary: string; flags: string[]; parameters: { name: string; value: string; status: string }[] }> = {
  "doc-cbc": {
    summary: "Complete Blood Count analysis reveals borderline microcytic anemia. Red blood cell indicators suggest possible iron deficiency. White blood cell lines and platelets remain well within normal guidelines.",
    flags: ["Low Hemoglobin (11.2 g/dL)", "Microcytic RBC indices"],
    parameters: [
      { name: "Hemoglobin", value: "11.2 g/dL", status: "Low" },
      { name: "Platelet Count", value: "245,000 /uL", status: "Normal" },
      { name: "WBC Count", value: "6.8 x10^3 /uL", status: "Normal" },
      { name: "Hematocrit", value: "34.2%", status: "Low" }
    ]
  },
  "doc-cardio": {
    summary: "Exercise treadmill test demonstrates normal chronotropic response. No exercise-induced ST-segment elevations or depressions noted. Heart rate recovery parameters are normal. Ejection fraction stable.",
    flags: ["No active ischemic EKG changes", "Good exercise tolerance"],
    parameters: [
      { name: "Peak Heart Rate", value: "154 bpm", status: "Normal" },
      { name: "METs Achieved", value: "10.2 METs", status: "Normal" },
      { name: "Resting Ejection Fraction", value: "58%", status: "Normal" },
      { name: "ST Segment Changes", value: "None detected", status: "Normal" }
    ]
  },
  "doc-biopsy": {
    summary: "Histological check of the skin lesion excision shows benign intradermal melanocytic nevus. Clear surgical margins are present. No cellular atypia or indicators of melanoma seen.",
    flags: ["Benign histopathology", "Surgical margins clear"],
    parameters: [
      { name: "Margin Assessment", value: "Clear (>2mm)", status: "Normal" },
      { name: "Mitotic Figure count", value: "0 / mm2", status: "Normal" },
      { name: "Nuclear atypia", value: "Absent", status: "Normal" }
    ]
  }
};

// AI Medical Knowledge Base
const KNOWLEDGE_BASE = {
  cardio: {
    title: "ACC/AHA Stable Angina Guidelines Summary",
    content: "For patients with suspected stable angina, initial management includes Aspirin 75-162mg daily, beta-blocker therapy, and sublingual Nitroglycerin for acute relief. Refer for EKG and exercise stress testing or CCTA if risk factors are high. Assess for statin therapy targets (LDL-C < 70 mg/dL or 50% reduction)."
  },
  hypertension: {
    title: "JNC8 Hypertension Treatment Guidelines",
    content: "For patients aged >= 18 with hypertension, initiate pharmacological therapy if BP >= 140/90. Target blood pressure is < 140/90 mmHg for general populations and < 130/80 mmHg per recent ACC/AHA criteria. Preferred first-line classes: ACE inhibitors (e.g. Lisinopril), ARBs (e.g. Losartan), Calcium Channel Blockers, or Thiazide diuretics."
  },
  asthma: {
    title: "GINA Pediatric Asthma Exacerbation Guidelines",
    content: "First line treatment for acute pediatric asthma exacerbation is short-acting beta-agonists (SABA, e.g. Albuterol) via MDI with spacer (2-6 puffs every 20 mins for 1 hour). If response is poor or patient is waking up coughing, add oral corticosteroids (Prednisolone 1-2 mg/kg/day up to 5 days). Re-assess controls in 2 weeks."
  }
};

export default function PatientDetailClient({
  patient,
  encounters,
  notes,
  reports,
}: PatientDetailClientProps) {
  // Timeline list state (supports instant updates on note sign)
  const [activeEncounters, setActiveEncounters] = useState<Encounter[]>(encounters);
  const [activeNotes, setActiveNotes] = useState<ClinicalNote[]>(notes);

  // Selected encounter
  const [selectedEncounterId, setSelectedEncounterId] = useState<string>(
    encounters[0]?.id || ""
  );
  
  // History editing states
  const [isEditingHistory, setIsEditingHistory] = useState(false);
  const [historyText, setHistoryText] = useState(patient.medicalHistory || "");
  const [isSavingHistory, setIsSavingHistory] = useState(false);

  // Note display tab
  const [activeTab, setActiveTab] = useState<"clinical" | "transcript" | "patient" | "analyzer">("clinical");

  // Document Analyzer state
  const [selectedDocId, setSelectedDocId] = useState("doc-cbc");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<any>(null);

  // Jargon Translator state
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [isSavingReport, setIsSavingReport] = useState(false);
  const [activeReports, setActiveReports] = useState<Report[]>(reports);

  // Timeline keyword search query
  const [recordSearchQuery, setRecordSearchQuery] = useState("");

  // Auto-trigger scribe console if ?scribe=true is present in query parameters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("scribe") === "true") {
        setShowInlineScribe(true);
      }
    }
  }, []);

  // ================= INLINE AI SCRIBE STATES =================
  const [showInlineScribe, setShowInlineScribe] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState("cardiology-chest-pain");
  const [scribeNoteType, setScribeNoteType] = useState<"SOAP" | "PROGRESS" | "CONSULTATION" | "REFERRAL">("SOAP");
  const [isRecording, setIsRecording] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [scribeTranscript, setScribeTranscript] = useState("");
  const [scribeDurationSec, setScribeDurationSec] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeKnowledgeKey, setActiveKnowledgeKey] = useState<"cardio" | "hypertension" | "asthma" | null>(null);

  // Generated Scribe SOAP fields
  const [soapSubjective, setSoapSubjective] = useState("");
  const [soapObjective, setSoapObjective] = useState("");
  const [soapAssessment, setSoapAssessment] = useState("");
  const [soapPlan, setSoapPlan] = useState("");
  const [progressContent, setProgressContent] = useState("");
  const [referralRecipient, setReferralRecipient] = useState("");
  const [referralReason, setReferralReason] = useState("");
  const [referralHistory, setReferralHistory] = useState("");
  const [referralUrgency, setReferralUrgency] = useState("");
  const [consultationContent, setConsultationContent] = useState("");

  const [qualityScore, setQualityScore] = useState(100);
  const [qualityFeedback, setQualityFeedback] = useState<{ warnings: string[]; suggestions: string[] }>({
    warnings: [],
    suggestions: []
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  // Calculate patient age helper
  const calculateAge = (dobString: string) => {
    const birthDate = new Date(dobString);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // Find active simulation details
  const activeScenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];

  // Map specialty simulation selector to matching patient record automatically
  useEffect(() => {
    if (patient.id === "patient-1") setSelectedScenarioId("cardiology-chest-pain");
    else if (patient.id === "patient-2") setSelectedScenarioId("dermatology-acne");
    else if (patient.id === "patient-3") setSelectedScenarioId("dental-cavity");
  }, [patient.id]);

  // Real-Time Conversation Intelligence
  const getRealTimeIntelligence = (text: string) => {
    const lowercase = text.toLowerCase();
    const symptoms: string[] = [];
    let duration = "";
    const associated: string[] = [];
    const missing: string[] = [];

    if (lowercase.includes("chest pain") || lowercase.includes("squeezing feeling") || lowercase.includes("heaviness")) {
      symptoms.push("Chest Pressure");
    }
    if (lowercase.includes("cough")) {
      symptoms.push("Coughing");
    }
    if (lowercase.includes("wheez")) {
      symptoms.push("Wheezing");
    }
    if (lowercase.includes("breakout") || lowercase.includes("bump") || lowercase.includes("acne")) {
      symptoms.push("Inflammatory Acne");
    }
    if (lowercase.includes("decay") || lowercase.includes("cavity")) {
      symptoms.push("Dental Decay");
    }

    // Duration extraction
    if (lowercase.includes("three days") || lowercase.includes("3 days")) {
      duration = "3 days";
    } else if (lowercase.includes("two days") || lowercase.includes("2 days")) {
      duration = "2 days";
    } else if (lowercase.includes("six weeks") || lowercase.includes("6 weeks")) {
      duration = "6 weeks";
    }

    // Associated signs
    if (lowercase.includes("shortness of breath") || lowercase.includes("breath")) {
      associated.push("Shortness of breath (dyspnea)");
    }
    if (lowercase.includes("sleep") || lowercase.includes("wake up") || lowercase.includes("woke")) {
      associated.push("Sleep disruption");
    }
    if (lowercase.includes("dry") || lowercase.includes("flak")) {
      associated.push("Skin dryness / flaking");
    }

    // Missing questions mapping
    if (!lowercase.includes("sleep")) {
      missing.push("Ask about sleep pattern");
    }
    if (!lowercase.includes("family")) {
      missing.push("Verify family cardiovascular history");
    }
    if (!lowercase.includes("allergy") && !lowercase.includes("allergies")) {
      missing.push("Confirm medication allergies");
    }

    return { symptoms, duration, associated, missing };
  };

  const rtIntel = getRealTimeIntelligence(scribeTranscript);

  // Start live mic recording simulation
  const startRecording = () => {
    setIsRecording(true);
    setScribeTranscript("Listening to ambient clinical dialogue... [Speech-to-Text active]");
    setScribeDurationSec(0);
    setHasGenerated(false);
    
    timerRef.current = setInterval(() => {
      setScribeDurationSec((prev) => prev + 1);
    }, 1000);
  };

  // Stop mic recording
  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setScribeTranscript(
      `Dr. Sarah: Let's follow up on the symptoms. Patient presents with standard complaints relating to their condition. Lungs check out clear. Prescribing target treatment. Follow up in ${selectedScenarioId === "dermatology-acne" ? "6 weeks" : "2 weeks"}.`
    );
  };

  // Trigger simulated conversation stream
  const simulateScribeStream = () => {
    setIsSimulating(true);
    setScribeTranscript("");
    setScribeDurationSec(0);
    setHasGenerated(false);

    timerRef.current = setInterval(() => {
      setScribeDurationSec((prev) => prev + 1);
    }, 1000);

    const words = activeScenario.transcript.split(" ");
    let idx = 0;
    const stream = setInterval(() => {
      if (idx < words.length) {
        setScribeTranscript((prev) => prev + (prev ? " " : "") + words[idx]);
        idx++;
      } else {
        clearInterval(stream);
        setIsSimulating(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 100);
  };

  // SOAP generator
  const handleGenerateScribeNote = () => {
    if (!scribeTranscript) return;
    setIsGenerating(true);
    setTimeout(() => {
      setSoapSubjective(activeScenario.notes.SOAP.subjective);
      setSoapObjective(activeScenario.notes.SOAP.objective);
      setSoapAssessment(activeScenario.notes.SOAP.assessment);
      setSoapPlan(activeScenario.notes.SOAP.plan);

      setProgressContent(activeScenario.notes.PROGRESS);
      setReferralRecipient(activeScenario.notes.REFERRAL.recipient);
      setReferralReason(activeScenario.notes.REFERRAL.reason);
      setReferralHistory(activeScenario.notes.REFERRAL.history);
      setReferralUrgency(activeScenario.notes.REFERRAL.urgency);
      setConsultationContent(activeScenario.notes.CONSULTATION);

      setQualityScore(activeScenario.qualityScore);
      setQualityFeedback(activeScenario.qualityFeedback);

      setIsGenerating(false);
      setHasGenerated(true);
    }, 1500);
  };

  // Accept and Sign Encounter Note (Updates timeline list in client state instantly!)
  const handleSaveScribeEncounter = async () => {
    setIsSaving(true);
    
    let structuredContent = "";
    if (scribeNoteType === "SOAP") {
      structuredContent = JSON.stringify({
        subjective: soapSubjective,
        objective: soapObjective,
        assessment: soapAssessment,
        plan: soapPlan
      });
    } else if (scribeNoteType === "PROGRESS") {
      structuredContent = JSON.stringify({ progress: progressContent });
    } else if (scribeNoteType === "REFERRAL") {
      structuredContent = JSON.stringify({
        recipient: referralRecipient,
        reason: referralReason,
        history: referralHistory,
        urgency: referralUrgency
      });
    } else {
      structuredContent = JSON.stringify({ consultation: consultationContent });
    }

    const res = await saveEncounterAction({
      patientId: patient.id,
      transcript: scribeTranscript,
      specialty: activeScenario.specialty,
      noteType: scribeNoteType,
      noteContent: structuredContent,
      qualityScore: qualityScore,
      qualityFeedback: JSON.stringify(qualityFeedback),
      durationSec: scribeDurationSec || 120
    });

    setIsSaving(false);
    if (res.success) {
      // Append the newly saved encounter to the active list locally
      const newEnc: Encounter = {
        id: res.encounterId || `encounter-${Date.now()}`,
        patientId: patient.id,
        doctorId: "doctor-sarah",
        date: new Date().toISOString(),
        transcript: scribeTranscript,
        status: "COMPLETED",
        createdAt: new Date().toISOString()
      };
      
      const newNote: ClinicalNote = {
        id: `note-${Date.now()}`,
        encounterId: newEnc.id,
        type: scribeNoteType,
        content: structuredContent,
        qualityScore: qualityScore,
        qualityFeedback: JSON.stringify(qualityFeedback),
        createdAt: new Date().toISOString()
      };

      setActiveEncounters([newEnc, ...activeEncounters]);
      setActiveNotes([newNote, ...activeNotes]);
      setSelectedEncounterId(newEnc.id);
      
      // Close the scribe overlay
      setShowInlineScribe(false);
      setScribeTranscript("");
      setHasGenerated(false);
      alert("Encounter signed and updated in visual health timeline!");
    } else {
      alert("Error: " + res.error);
    }
  };

  // ================= END INLINE AI SCRIBE =================

  // Save updated medical history
  const handleSaveHistory = async () => {
    setIsSavingHistory(true);
    const res = await updatePatientHistoryAction(patient.id, historyText);
    setIsSavingHistory(false);
    if (res.success) {
      setIsEditingHistory(false);
    } else {
      alert("Error: " + res.error);
    }
  };

  // Run PDF lab scanner
  const handleAnalyzeDocument = () => {
    setIsAnalyzing(true);
    setAnalysisReport(null);
    setTimeout(() => {
      setAnalysisReport(ANALYZER_REPORTS[selectedDocId] || ANALYZER_REPORTS["doc-cbc"]);
      setIsAnalyzing(false);
    }, 1000);
  };

  const activeEncounter = activeEncounters.find((e) => e.id === selectedEncounterId);
  const activeNote = activeNotes.find((n) => n.encounterId === selectedEncounterId);

  // Parse clinical notes safely
  const getParsedNoteContent = () => {
    if (!activeNote) return null;
    try {
      return JSON.parse(activeNote.content);
    } catch {
      return { content: activeNote.content };
    }
  };
  const parsedNote = getParsedNoteContent();

  // Keyword filter on past encounters
  const filteredEncounters = activeEncounters.filter((e) => {
    if (!recordSearchQuery) return true;
    const q = recordSearchQuery.toLowerCase();
    if (e.transcript.toLowerCase().includes(q)) return true;
    const n = activeNotes.find((note) => note.encounterId === e.id);
    if (n && n.content.toLowerCase().includes(q)) return true;
    return false;
  });

  const generatePatientFriendlyExplanation = () => {
    if (!activeNote || !parsedNote) return;
    setIsTranslating(true);

    setTimeout(() => {
      let translation = "";
      if (activeNote.type === "SOAP") {
        const subjectiveText = parsedNote.subjective || "";
        const planText = parsedNote.plan || "";
        
        translation = `### Your Visit Summary - Plain English Explanation\n\n`;
        translation += `**What We Discussed (Your Symptoms):**\n`;
        
        let subPlain = subjectiveText
          .replace(/patient is a \d+-year-old male/i, "You")
          .replace(/patient is a \d+-year-old female/i, "You")
          .replace(/history of hypertension/i, "history of high blood pressure")
          .replace(/new onset of chest pain/i, "new onset of chest tightness/pain")
          .replace(/exertion/i, "physical activities (like climbing stairs)")
          .replace(/dyspnea/i, "shortness of breath")
          .replace(/denies radiation, diaphoresis, nausea/i, "you confirmed there is no sweating, nausea, or pain spreading to your jaw/arms");
        
        translation += `${subPlain}\n\n`;
        translation += `**Our Treatment Plan & Next Steps:**\n`;
        
        let planPlain = planText
          .replace(/refer to Cardiology/i, "refer you to a Heart Specialist (Cardiologist)")
          .replace(/exercise stress testing/i, "a treadmill stress test to see how your heart handles physical exercise")
          .replace(/initiate low-dose Aspirin \(81mg orally daily\)/i, "start taking one baby Aspirin (81mg tablet) by mouth every day")
          .replace(/patient educated on strict warning signs/i, "we spent time discussing crucial emergency signs")
          .replace(/unstable angina\/myocardial infarction/i, "worsening chest disease or heart attack warnings")
          .replace(/diaphoresis/i, "sudden cold sweating")
          .replace(/severe dyspnea/i, "trouble catching your breath")
          .replace(/Prednisolone/i, "Prednisolone (a liquid steroid to reduce throat and lung swelling)")
          .replace(/Albuterol HFA/i, "Albuterol rescue inhaler")
          .replace(/once daily in the morning/i, "once every morning")
          .replace(/Tretinoin 0.025% cream/i, "Tretinoin cream (a prescription skin repair cream to clear pores)")
          .replace(/occlusal caries/i, "tooth decay on the biting surface of the molar")
          .replace(/composite resin restoration/i, "a tooth-colored filling")
          .replace(/prophylaxis/i, "professional scaling and clean");
          
        translation += `${planPlain}\n\n`;
        translation += `**AI Automated Follow-Up Guidelines:**\n`;
        translation += `- **Day 7 (Symptom Check):** Call the clinic to report if your medication causes any stomach discomfort.\n`;
        translation += `- **Day 30 (Specialist Review):** Ensure the Cardiology stress test has been scheduled.\n`;
        translation += `- **Day 90 (Routine Review):** Schedule your follow-up check in our clinic for blood pressure calibration.\n\n`;
        
        translation += `**Questions to Ask Your Doctor on Your Next Visit:**\n`;
        translation += `1. Has my chest squeezing frequency decreased with daily baby Aspirin?\n`;
        translation += `2. What are the results of my cardiology exercise stress test?\n`;
        translation += `3. Are there any restrictions on my exercise levels?\n\n`;
        
        translation += `> **Emergency Instructions:** If you experience crushing chest squeeze, pain spreading to your arm or jaw, sudden sweating, or severe breathing distress, please call 911 or go to the nearest emergency room immediately.`;
      } else {
        translation = `### Summary of Today's Assessment\n\n`;
        translation += `Today we reviewed your active symptoms. We have updated your medication plan and arranged a specialist checkup. Please read the plan outlined in your portal files, and take all tablets as directed.\n\n`;
        
        translation += `**AI Automated Follow-Up Guidelines:**\n`;
        translation += `- **Day 7:** Review home recovery notes.\n`;
        translation += `- **Day 30:** Routine clinic check-up.\n\n`;
        
        translation += `**Questions for Next Visit:**\n`;
        translation += `1. Is my recovery progressing as expected?\n`;
        translation += `2. Do I need to continue this treatment plan?`;
      }
      
      setTranslatedText(translation);
      setIsTranslating(false);
    }, 1000);
  };

  const handleSaveReport = async () => {
    if (!translatedText) return;
    setIsSavingReport(true);
    
    const title = `AI Patient Guide - ${new Date(activeEncounter?.date || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    const res = await createPatientReportAction(
      patient.id,
      title,
      "PATIENT_INSTRUCTIONS",
      translatedText
    );

    setIsSavingReport(false);
    if (res.success) {
      const newReport: Report = {
        id: `report-${Math.random().toString(36).substr(2, 9)}`,
        patientId: patient.id,
        type: "PATIENT_INSTRUCTIONS",
        title: title,
        content: translatedText,
        createdAt: new Date().toISOString()
      };
      setActiveReports([newReport, ...activeReports]);
      alert("Successfully published explanation to Patient Portal!");
      setTranslatedText("");
      setActiveTab("clinical");
    } else {
      alert("Error saving report: " + res.error);
    }
  };

  const brief = CLINICAL_BRIEFS[patient.id] || CLINICAL_BRIEFS["patient-1"];
  const story = PATIENT_JOURNEYS[patient.id] || PATIENT_JOURNEYS["patient-1"];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* ================= PATIENT HEADER BANNER ================= */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2.5 h-full bg-accent"></div>
        
        <div className="flex items-center gap-4 pl-3">
          <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xl ring-4 ring-accent/5">
            {patient.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{patient.name}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {patient.gender} • Age {calculateAge(patient.dob)} • DOB {new Date(patient.dob).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => {
              setShowInlineScribe(!showInlineScribe);
              setScribeTranscript("");
              setHasGenerated(false);
            }}
            className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-4 rounded-xl transition text-xs shadow-md shadow-accent/25 h-11"
          >
            <Mic className="w-4 h-4" />
            {showInlineScribe ? "Close Scribe Console" : "Start Scribe Encounter"}
          </button>
        </div>
      </div>

      {/* ================= AI CLINICAL BRIEF ================= */}
      <div className="bg-gradient-to-br from-card to-secondary/30 border border-border rounded-2xl p-6 shadow-sm space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-full bg-accent/5 filter blur-3xl"></div>
        
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Brain className="w-5 h-5 text-accent animate-pulse-ring" />
            AI Clinical Brief (Clinical Operating System Mode)
          </h3>
          <span className="text-[9px] bg-accent/15 text-accent font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-accent/20">
            Pre-Encounter Dashboard
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          <div className="space-y-2 border-b md:border-b-0 md:border-r border-border/40 pb-4 md:pb-0 pr-0 md:pr-4">
            <div className="flex items-center gap-1 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
              <Bookmark className="w-3.5 h-3.5 text-accent" />
              Previous History
            </div>
            <p className="text-foreground leading-relaxed font-semibold">{brief.history}</p>
          </div>

          <div className="space-y-2 border-b md:border-b-0 md:border-r border-border/40 pb-4 md:pb-0 pr-0 md:pr-4">
            <div className="flex items-center gap-1 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
              <CalendarDays className="w-3.5 h-3.5 text-accent" />
              Last Visit details
            </div>
            <p className="text-foreground leading-relaxed">{brief.lastVisit}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
              <TrendingUp className="w-3.5 h-3.5 text-accent" />
              Today's Consultation Focus
            </div>
            <p className="text-foreground leading-relaxed font-bold">{brief.focus}</p>
          </div>

        </div>

        {/* Suggested Questions checklist */}
        <div className="pt-4 border-t border-border/40 mt-4 space-y-2.5">
          <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
            Suggested Investigation Questions:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {brief.questions.map((q, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-secondary/30 p-2 rounded-lg border border-border/40 text-foreground/80">
                <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= EDITABLE MEDICAL HISTORY ================= */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent" />
            EHR Clinical Medical History
          </h3>
          {!isEditingHistory ? (
            <button
              onClick={() => setIsEditingHistory(true)}
              className="flex items-center gap-1 text-xs text-accent hover:underline font-semibold"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit History
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveHistory}
                disabled={isSavingHistory}
                className="flex items-center gap-1 text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-lg font-semibold hover:bg-accent/90 transition"
              >
                {isSavingHistory ? "Saving..." : <><Check className="w-3 h-3" /> Save</>}
              </button>
              <button
                onClick={() => {
                  setHistoryText(patient.medicalHistory || "");
                  setIsEditingHistory(false);
                }}
                className="text-xs bg-secondary hover:bg-border text-muted-foreground px-2.5 py-1 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {isEditingHistory ? (
          <textarea
            value={historyText}
            onChange={(e) => setHistoryText(e.target.value)}
            className="w-full h-24 bg-secondary/30 border border-border/80 focus:border-accent rounded-xl p-3 focus:outline-none text-sm leading-relaxed"
          />
        ) : (
          <p className="text-sm text-foreground leading-relaxed">
            {patient.medicalHistory || "No previous history logged in chart."}
          </p>
        )}
      </div>

      {/* ================= MAIN CO-LAYOUT GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: TIMELINE & JOURNEY STORY PANELS */}
        <div className="space-y-6">
          
          {/* AI Record Search & Timeline list */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg tracking-tight">Visit Timeline</h3>

            {/* Keyword Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                value={recordSearchQuery}
                onChange={(e) => setRecordSearchQuery(e.target.value)}
                placeholder="Search record keyword (e.g. cough, BP)..."
                className="w-full pl-9 pr-4 py-2 bg-card border border-border/80 focus:border-accent rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6 relative">
              <div className="absolute left-[37px] top-10 bottom-10 w-0.5 bg-border/80"></div>

              {filteredEncounters.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No matching records found.</p>
              ) : (
                filteredEncounters.map((enc) => {
                  const isActive = enc.id === selectedEncounterId && !showInlineScribe;
                  const formattedDate = new Date(enc.date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                    day: "numeric"
                  });

                  return (
                    <div 
                      key={enc.id}
                      onClick={() => {
                        setSelectedEncounterId(enc.id);
                        setShowInlineScribe(false);
                        setTranslatedText("");
                      }}
                      className="flex gap-4 cursor-pointer group relative"
                    >
                      {/* Circle Indicator */}
                      <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center z-10 transition-all shrink-0 ${
                        isActive 
                          ? "bg-accent border-accent-foreground ring-4 ring-accent/15" 
                          : enc.status === "PENDING"
                            ? "bg-card border-amber-500 group-hover:border-amber-400"
                            : "bg-card border-border group-hover:border-accent"
                      }`}>
                        {enc.status === "COMPLETED" ? (
                          <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? "text-accent-foreground" : "text-emerald-500"}`} />
                        ) : (
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-accent-foreground" : "bg-amber-500"}`}></span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className={`text-xs font-bold ${isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground"}`}>
                          {formattedDate}
                        </span>
                        <h4 className={`text-sm font-bold leading-none ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                          {enc.status === "PENDING" ? "Encounter Pending Review" : `Completed Encounter`}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {enc.transcript.substr(0, 50)}...
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* AI Patient Story Timeline */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-accent" />
              AI Patient Story Journey
            </h3>
            
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6 relative">
              <div className="absolute left-[33px] top-8 bottom-8 w-0.5 bg-border/40"></div>

              {story.map((milestone, idx) => (
                <div key={idx} className="flex gap-4 relative animate-fade-in">
                  <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] z-10 border border-border shadow-sm">
                    {milestone.icon}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-accent uppercase tracking-widest block">
                      {milestone.year} Milestone
                    </span>
                    <h4 className="text-xs font-bold text-foreground">
                      {milestone.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {milestone.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Reports & Documents */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg tracking-tight">Patient Portal Documents</h3>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-3">
              {activeReports.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center">No patient instructions generated yet.</p>
              ) : (
                activeReports.map((rep) => (
                  <div 
                    key={rep.id}
                    className="flex items-center gap-3 p-3 bg-secondary/30 hover:bg-secondary/55 border border-border/50 rounded-xl transition cursor-pointer"
                    onClick={() => {
                      alert(`${rep.title}\n\n${rep.content}`);
                    }}
                  >
                    <FileText className="w-5 h-5 text-accent shrink-0" />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-foreground truncate">{rep.title}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Published: {new Date(rep.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: UNIFIED SCRIBE OR NOTES EXPLORER */}
        <div className="lg:col-span-2 space-y-6">
          
          {showInlineScribe ? (
            /* ================= INLINE AI SCRIBE WORKSPACE ================= */
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-md animate-fade-in">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-sm tracking-tight text-foreground flex items-center gap-2">
                  <Mic className="w-4 h-4 text-accent animate-pulse" />
                  Inline AI Scribe Consultation Session
                </h3>
                <span className="font-mono text-xs text-muted-foreground">
                  Session: {formatTime(scribeDurationSec)}
                </span>
              </div>

              {/* Scribe parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Specialty Model</label>
                  <select 
                    value={selectedScenarioId}
                    onChange={(e) => setSelectedScenarioId(e.target.value)}
                    className="w-full text-xs bg-secondary border border-border/85 rounded-lg px-2.5 py-2 text-foreground"
                    disabled={isSimulating || isRecording}
                  >
                    <option value="cardiology-chest-pain">Cardiology Exertional Angina</option>
                    <option value="pediatrics-asthma">Pediatric Asthma Wheeze</option>
                    <option value="dermatology-acne">Dermatology Comedonal Acne</option>
                    <option value="dental-cavity">Dental Caries Restoration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Note Output Format</label>
                  <select 
                    value={scribeNoteType}
                    onChange={(e: any) => setScribeNoteType(e.target.value)}
                    className="w-full text-xs bg-secondary border border-border/85 rounded-lg px-2.5 py-2 text-foreground"
                  >
                    <option value="SOAP">SOAP Notes</option>
                    <option value="PROGRESS">Progress Notes</option>
                    <option value="REFERRAL">Referral Letters</option>
                    <option value="CONSULTATION">Consultation Summary</option>
                  </select>
                </div>
              </div>

              {/* Audio waveform */}
              <Waveform isRecording={isRecording || isSimulating} />

              {/* Actions bar */}
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <button
                  type="button"
                  onClick={simulateScribeStream}
                  disabled={isRecording || isSimulating}
                  className="flex items-center justify-center gap-1.5 bg-secondary hover:bg-border text-[11px] font-semibold px-4 rounded-xl border border-border transition disabled:opacity-50 h-11"
                >
                  <Volume2 className="w-3.5 h-3.5 text-accent animate-pulse" />
                  Simulate Patient Speech
                </button>

                <div className="flex gap-2">
                  {isRecording ? (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="bg-destructive text-white text-[11px] font-bold px-4 rounded-xl h-11 flex items-center justify-center"
                    >
                      Stop mic
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isSimulating}
                      onClick={startRecording}
                      className="bg-accent text-accent-foreground text-[11px] font-bold px-4 rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50 h-11"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      Record Mic
                    </button>
                  )}
                </div>
              </div>

              {/* Real-time Intel panel */}
              {scribeTranscript && (
                <div className="bg-secondary/40 border border-border/60 rounded-xl p-3.5 text-[11px] space-y-2 leading-relaxed">
                  <span className="font-extrabold text-accent text-[9px] uppercase tracking-wider block">Real-Time Extraction Metrics</span>
                  <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                    <p>Symptoms: <strong className="text-foreground">{rtIntel.symptoms.join(", ") || "None"}</strong></p>
                    <p>Duration: <strong className="text-foreground">{rtIntel.duration || "None"}</strong></p>
                    <p>Associated: <strong className="text-foreground">{rtIntel.associated.join(", ") || "None"}</strong></p>
                    <p className="col-span-2 text-amber-500">Missing check: {rtIntel.missing.join(" • ") || "✓ Complete"}</p>
                  </div>
                </div>
              )}

              {/* Transcript editor */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Dialogue Transcript</span>
                <textarea
                  value={scribeTranscript}
                  onChange={(e) => setScribeTranscript(e.target.value)}
                  className="w-full h-32 bg-secondary/30 border border-border/80 rounded-xl p-3 text-xs leading-relaxed focus:outline-none"
                  placeholder="Dialogue will stream here..."
                />
              </div>

              {/* Medical knowledge widget inside inline workspace */}
              <div className="p-4 bg-secondary/30 rounded-xl border border-border/40 space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-accent" />
                  Clinical Guidelines Hub
                </span>
                <div className="flex gap-2 text-[9px]">
                  <button 
                    type="button"
                    onClick={() => setActiveKnowledgeKey(activeKnowledgeKey === "cardio" ? null : "cardio")}
                    className={`border px-2 py-1 rounded ${activeKnowledgeKey === "cardio" ? "bg-accent text-accent-foreground border-accent" : "bg-card text-muted-foreground border-border"}`}
                  >
                    ACC Angina
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveKnowledgeKey(activeKnowledgeKey === "hypertension" ? null : "hypertension")}
                    className={`border px-2 py-1 rounded ${activeKnowledgeKey === "hypertension" ? "bg-accent text-accent-foreground border-accent" : "bg-card text-muted-foreground border-border"}`}
                  >
                    JNC8 BP
                  </button>
                </div>
                {activeKnowledgeKey && (
                  <p className="text-[10px] text-muted-foreground bg-card p-2 rounded border border-border/40 mt-1">
                    {KNOWLEDGE_BASE[activeKnowledgeKey].content}
                  </p>
                )}
              </div>

              {/* Note creator buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGenerateScribeNote}
                  disabled={!scribeTranscript || isGenerating}
                  className="w-full bg-accent text-accent-foreground font-bold rounded-xl text-xs transition disabled:opacity-50 h-11 flex items-center justify-center"
                >
                  {isGenerating ? "Clinova AI Mapping..." : "Structure Medical Documentation"}
                </button>

                {hasGenerated && (
                  <div className="space-y-4 animate-fade-in border-t border-border/40 pt-4">
                    <div className="flex items-center gap-3 bg-secondary/40 p-3 rounded-xl border border-border/60 text-xs">
                      <ScoreRing score={qualityScore} size={36} strokeWidth={3} />
                      <div>
                        <span className="font-bold text-foreground block">Completeness Score: {qualityScore}%</span>
                        <span className="text-[10px] text-muted-foreground">Audited by Clinova OS</span>
                      </div>
                    </div>

                    {/* Simple note preview display inside scribe check */}
                    {scribeNoteType === "SOAP" && (
                      <div className="space-y-2 text-xs">
                        <input type="text" className="w-full bg-secondary border border-border p-2 rounded" value={soapSubjective} onChange={(e) => setSoapSubjective(e.target.value)} placeholder="Subjective" />
                        <input type="text" className="w-full bg-secondary border border-border p-2 rounded" value={soapObjective} onChange={(e) => setSoapObjective(e.target.value)} placeholder="Objective" />
                        <input type="text" className="w-full bg-secondary border border-border p-2 rounded" value={soapAssessment} onChange={(e) => setSoapAssessment(e.target.value)} placeholder="Assessment" />
                        <input type="text" className="w-full bg-secondary border border-border p-2 rounded" value={soapPlan} onChange={(e) => setSoapPlan(e.target.value)} placeholder="Plan" />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleSaveScribeEncounter}
                      disabled={isSaving}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 h-11"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Accept & Sign Document to EHR
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ================= STANDALONE EHR NOTES VIEWER ================= */
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    Encounter Details & Notes
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Select a timeline node or click 'Start Scribe' to document a new visit.
                  </p>
                </div>
                
                {/* Note Tabs */}
                <div className="flex overflow-x-auto whitespace-nowrap scrollbar-none border border-border rounded-lg bg-secondary/50 p-1 text-[11px] max-w-full w-full sm:w-auto">
                  <button
                    onClick={() => setActiveTab("clinical")}
                    className={`shrink-0 py-2 px-3 rounded-md font-bold transition-all ${
                      activeTab === "clinical" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Note Draft
                  </button>
                  <button
                    onClick={() => setActiveTab("transcript")}
                    className={`shrink-0 py-2 px-3 rounded-md font-bold transition-all ${
                      activeTab === "transcript" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Dialogue
                  </button>
                  <button
                    onClick={() => setActiveTab("patient")}
                    className={`shrink-0 py-2 px-3 rounded-md font-bold transition-all ${
                      activeTab === "patient" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Patient Summary
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("analyzer");
                      setAnalysisReport(null);
                    }}
                    className={`shrink-0 py-2 px-3 rounded-md font-bold transition-all ${
                      activeTab === "analyzer" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Doc Analyzer
                  </button>
                </div>
              </div>

              {/* Tab 1: Clinical Note display */}
              {activeTab === "clinical" && (
                <div className="space-y-6">
                  {!activeNote ? (
                    <p className="text-xs text-muted-foreground text-center py-6">No clinical note selected.</p>
                  ) : activeNote.type === "SOAP" && parsedNote ? (
                    <div className="space-y-4 text-xs leading-relaxed">
                      <div className="p-4 bg-secondary/20 rounded-xl border border-border/50">
                        <span className="text-[10px] font-extrabold text-accent uppercase tracking-wider block mb-2">Subjective (S)</span>
                        <p className="text-foreground text-xs leading-relaxed">{parsedNote.subjective}</p>
                      </div>
                      <div className="p-4 bg-secondary/20 rounded-xl border border-border/50">
                        <span className="text-[10px] font-extrabold text-accent uppercase tracking-wider block mb-2">Objective (O)</span>
                        <p className="text-foreground text-xs leading-relaxed">{parsedNote.objective}</p>
                      </div>
                      <div className="p-4 bg-secondary/20 rounded-xl border border-border/50">
                        <span className="text-[10px] font-extrabold text-accent uppercase tracking-wider block mb-2">Assessment (A)</span>
                        <p className="text-foreground text-xs leading-relaxed">{parsedNote.assessment}</p>
                      </div>
                      <div className="p-4 bg-secondary/20 rounded-xl border border-border/50">
                        <span className="text-[10px] font-extrabold text-accent uppercase tracking-wider block mb-2">Plan (P)</span>
                        <p className="text-foreground text-xs leading-relaxed">{parsedNote.plan}</p>
                      </div>
                    </div>
                  ) : (
                    // Generic note fallback
                    <div className="p-4 bg-secondary/20 rounded-xl border border-border/50">
                      <pre className="text-xs text-foreground font-sans whitespace-pre-wrap leading-relaxed">
                        {JSON.stringify(parsedNote, null, 2)}
                      </pre>
                    </div>
                  )}

                  {activeNote && (
                    <div className="flex items-center justify-between p-3.5 bg-secondary/40 rounded-xl border border-border/50 text-xs">
                      <span className="text-muted-foreground">Completeness Score:</span>
                      <span className="font-bold text-accent">{activeNote.qualityScore}% Quality Compliance</span>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Dialogue Transcript */}
              {activeTab === "transcript" && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Dialogue Audio Script</span>
                  <div className="bg-secondary/20 border border-border/50 rounded-xl p-4 text-xs leading-relaxed max-h-[350px] overflow-y-auto font-mono whitespace-pre-wrap">
                    {activeEncounter?.transcript || "No transcript loaded."}
                  </div>
                </div>
              )}

              {/* Tab 3: Patient Version */}
              {activeTab === "patient" && (
                <div className="space-y-4">
                  {!translatedText ? (
                    <div className="bg-accent/5 p-6 rounded-xl border border-accent/20 text-center space-y-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto text-accent text-sm">
                        <Brain className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">AI Patient Explanation Generator</h4>
                        <p className="text-[11px] text-muted-foreground mt-1 max-w-xs mx-auto">
                          Convert complex medical jargon (angina, dyspnea, EKG findings) into clean, friendly plain English, appending follow-up timetables.
                        </p>
                      </div>
                      <button
                        onClick={generatePatientFriendlyExplanation}
                        disabled={isTranslating}
                        className="bg-accent text-accent-foreground font-bold text-xs px-4 rounded-xl transition hover:bg-accent/90 h-11 flex items-center justify-center"
                      >
                        {isTranslating ? "Translating Jargon..." : "Translate to Patient Version"}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fade-in text-xs leading-relaxed">
                      <div className="bg-secondary/30 border border-border/50 rounded-xl p-4 whitespace-pre-wrap text-foreground font-sans">
                        {translatedText}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleSaveReport}
                          disabled={isSavingReport}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs h-11 flex items-center justify-center"
                        >
                          {isSavingReport ? "Publishing..." : "Publish to Patient Portal & EHR Documents"}
                        </button>
                        <button
                          onClick={() => setTranslatedText("")}
                          className="bg-secondary hover:bg-border text-muted-foreground hover:text-foreground font-semibold px-4 rounded-xl border border-border transition text-xs h-11 flex items-center justify-center"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: AI Medical Document Analyzer */}
              {activeTab === "analyzer" && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <div className="bg-secondary/40 p-4 rounded-xl border border-border/60 space-y-3">
                    <span className="font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                      <Upload className="w-3.5 h-3.5 text-accent" />
                      Select Patient Document for AI Indexing
                    </span>

                    <select
                      value={selectedDocId}
                      onChange={(e) => {
                        setSelectedDocId(e.target.value);
                        setAnalysisReport(null);
                      }}
                      className="w-full text-xs bg-card border border-border rounded-lg px-2.5 text-foreground focus:outline-none h-11"
                    >
                      {ANALYZER_DOCUMENTS.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} ({doc.category} - {doc.date})
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleAnalyzeDocument}
                      disabled={isAnalyzing}
                      className="w-full bg-accent text-accent-foreground font-bold rounded-xl transition text-xs flex items-center justify-center gap-1.5 shadow h-11"
                    >
                      {isAnalyzing ? "Reading PDF scans..." : "Analyze Document with Clinova AI"}
                    </button>
                  </div>

                  {analysisReport && (
                    <div className="bg-secondary/30 border border-border/60 rounded-xl p-4 space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-[11px] block">
                          AI Document Summarization Report
                        </span>
                        <span className="text-[9px] bg-accent/15 text-accent font-bold px-2 py-0.5 rounded-full border border-accent/20">
                          Verified Scanner
                        </span>
                      </div>

                      <p className="text-muted-foreground leading-relaxed text-xs">
                        {analysisReport.summary}
                      </p>

                      {/* Diagnostic Flags */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Clinical Flags Extracted</span>
                        <div className="flex flex-wrap gap-1.5">
                          {analysisReport.flags.map((flag: string, idx: number) => (
                            <span key={idx} className="bg-destructive/10 text-destructive border border-destructive/20 px-2.5 py-0.5 rounded text-[10px] font-bold">
                              {flag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Parameters Table */}
                      <div className="border border-border/60 rounded-lg overflow-hidden bg-card">
                        <table className="w-full text-left text-[11px]">
                          <thead>
                            <tr className="bg-secondary/40 text-muted-foreground border-b border-border/60 font-bold uppercase tracking-wider text-[9px]">
                              <th className="px-3 py-2">Parameter</th>
                              <th className="px-3 py-2">Value</th>
                              <th className="px-3 py-2 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/65">
                            {analysisReport.parameters.map((param: any, idx: number) => (
                              <tr key={idx}>
                                <td className="px-3 py-2 font-semibold text-foreground">{param.name}</td>
                                <td className="px-3 py-2 text-muted-foreground font-mono">{param.value}</td>
                                <td className="px-3 py-2 text-right font-bold">
                                  <span className={param.status === "Low" ? "text-destructive" : "text-emerald-500"}>
                                    {param.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
        </div>

      </div>

    </div>
  );
}

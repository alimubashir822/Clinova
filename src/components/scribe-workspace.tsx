"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Patient } from "@/lib/db";
import { SCENARIOS, MedicalScenario } from "@/lib/scribe-scenarios";
import { saveEncounterAction } from "@/app/doctor/scribe/actions";
import Waveform from "@/components/ui/waveform";
import ScoreRing from "@/components/ui/score-ring";
import { 
  Mic, 
  Square, 
  Sparkles, 
  Check, 
  RotateCcw, 
  ChevronRight, 
  AlertTriangle,
  Lightbulb,
  FileCheck,
  Volume2,
  BookOpen,
  Eye,
  Info
} from "lucide-react";

interface ScribeWorkspaceProps {
  initialPatients: Patient[];
}

// AI Pre-Visit Brief Lookup
const PRE_VISIT_BRIEFS: Record<string, { risk: string; warning: string; concern: string; badgeColor: string }> = {
  "patient-1": { 
    risk: "Medium Risk", 
    warning: "Missed follow-up (April 2025 EKG overdue)", 
    concern: "Chest discomfort and exertional squeezing",
    badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20"
  },
  "patient-2": { 
    risk: "Low Risk", 
    warning: "Due for seasonal asthma control review", 
    concern: "Nocturnal cough and expiratory wheezing",
    badgeColor: "bg-primary/10 text-primary border-primary/20"
  },
  "patient-3": { 
    risk: "High Risk", 
    warning: "Awaiting dental molar pulp clearance review", 
    concern: "Tooth #14 deep decay occlusal caries",
    badgeColor: "bg-destructive/10 text-destructive border-destructive/20"
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

export default function ScribeWorkspace({ initialPatients }: ScribeWorkspaceProps) {
  const router = useRouter();

  // Active configurations
  const [patients] = useState<Patient[]>(initialPatients);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || "");
  const [selectedScenarioId, setSelectedScenarioId] = useState(SCENARIOS[0].id);
  const [noteType, setNoteType] = useState<"SOAP" | "PROGRESS" | "CONSULTATION" | "DISCHARGE" | "REFERRAL">("SOAP");

  // Voice recording & simulation states
  const [isRecording, setIsRecording] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [durationSec, setDurationSec] = useState(0);
  
  // Scribe processing states
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Knowledge Assistant Sidebar State
  const [activeKnowledgeKey, setActiveKnowledgeKey] = useState<"cardio" | "hypertension" | "asthma" | null>(null);

  // Generated output states (can be modified by doctor)
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

  // Stop timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Format timer duration
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  // Find current scenario details
  const activeScenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];

  // Auto-set the patient when scenario changes to make the simulation look realistic
  useEffect(() => {
    if (selectedScenarioId === "cardiology-chest-pain") {
      setSelectedPatientId("patient-1"); // John Doe
    } else if (selectedScenarioId === "pediatrics-asthma") {
      setSelectedPatientId("patient-2"); // Emily Chen (Mother of Sophia Martinez)
    } else if (selectedScenarioId === "dermatology-acne") {
      setSelectedPatientId("patient-2"); // Emily Chen
    } else if (selectedScenarioId === "dental-cavity") {
      setSelectedPatientId("patient-3"); // Marcus Thompson
    }
  }, [selectedScenarioId]);

  // Real-Time Conversation Intelligence parser
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

  const rtIntel = getRealTimeIntelligence(transcript);
  const activeBrief = PRE_VISIT_BRIEFS[selectedPatientId] || PRE_VISIT_BRIEFS["patient-1"];

  // Start live micro recording simulation
  const startRecording = () => {
    setIsRecording(true);
    setTranscript("Listening to ambient clinical dialogue... [Speech-to-Text active]");
    setDurationSec(0);
    setHasGenerated(false);
    
    timerRef.current = setInterval(() => {
      setDurationSec((prev) => prev + 1);
    }, 1000);
  };

  // Stop recording
  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTranscript(
      `Dr. Sarah: Let's follow up on the symptoms. Patient presents with standard complaints relating to their condition. Lungs check out clear. Prescribing target treatment. Follow up in ${selectedScenarioId === "dermatology-acne" ? "6 weeks" : "2 weeks"}.`
    );
  };

  // Stream word-by-word transcription simulation
  const simulateTranscription = () => {
    setIsSimulating(true);
    setTranscript("");
    setDurationSec(0);
    setHasGenerated(false);
    
    // Timer interval
    timerRef.current = setInterval(() => {
      setDurationSec((prev) => prev + 1);
    }, 1000);

    const words = activeScenario.transcript.split(" ");
    let index = 0;
    
    const streamInterval = setInterval(() => {
      if (index < words.length) {
        setTranscript((prev) => prev + (prev ? " " : "") + words[index]);
        index++;
      } else {
        clearInterval(streamInterval);
        setIsSimulating(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    }, 100); // streams about 10 words per second
  };

  // Trigger AI Clinical Note generation (SOAP note mapping)
  const generateClinicalDocumentation = () => {
    if (!transcript) return;
    setIsGenerating(true);

    setTimeout(() => {
      // Load parsed template structures from active scenario mock
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
    }, 1500); // 1.5 second loading delay
  };

  // Reset workspace
  const handleReset = () => {
    setTranscript("");
    setDurationSec(0);
    setHasGenerated(false);
    setIsRecording(false);
    setIsSimulating(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Call Server Action to save documentation
  const handleSaveEncounter = async () => {
    if (!selectedPatientId) return;
    setIsSaving(true);

    // Prepare note content based on active note type
    let structuredContent = "";
    if (noteType === "SOAP") {
      structuredContent = JSON.stringify({
        subjective: soapSubjective,
        objective: soapObjective,
        assessment: soapAssessment,
        plan: soapPlan
      });
    } else if (noteType === "PROGRESS") {
      structuredContent = JSON.stringify({ progress: progressContent });
    } else if (noteType === "REFERRAL") {
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
      patientId: selectedPatientId,
      transcript: transcript,
      specialty: activeScenario.specialty,
      noteType: noteType,
      noteContent: structuredContent,
      qualityScore: qualityScore,
      qualityFeedback: JSON.stringify(qualityFeedback),
      durationSec: durationSec || 120 // defaults to 2 minutes if 0
    });

    setIsSaving(false);
    if (res.success) {
      // Redirect to the updated patient timeline page
      router.push(`/doctor/patients/${selectedPatientId}`);
    } else {
      alert("Error: " + res.error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      
      {/* ================= LEFT COLUMN: SCRIBE INTERFACE ================= */}
      <div className="space-y-6">
        
        {/* AI Pre-Visit Patient Brief Card */}
        <div className="bg-gradient-to-br from-card to-secondary/40 border border-border rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-full bg-accent/5 filter blur-xl"></div>
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-accent" />
              AI Pre-Visit Patient Brief
            </span>
            <span className={`text-[9px] border font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${activeBrief.badgeColor}`}>
              {activeBrief.risk}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground block text-[10px]">Previous Concern:</span>
              <span className="font-bold text-foreground">{activeBrief.concern}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block text-[10px]">Important Alert:</span>
              <span className="font-bold text-amber-500 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                {activeBrief.warning}
              </span>
            </div>
          </div>
        </div>

        {/* Scribe Controls Card */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
          
          {/* Step 1 Header: Patient & Scenario Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Select Patient
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full text-sm bg-secondary border border-border/80 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.gender}, Age {new Date().getFullYear() - new Date(p.dob).getFullYear()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Specialty Simulation
              </label>
              <select
                value={selectedScenarioId}
                onChange={(e) => setSelectedScenarioId(e.target.value)}
                className="w-full text-sm bg-secondary border border-border/80 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
                disabled={isRecording || isSimulating}
              >
                {SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <hr className="border-border/50" />

          {/* Audio Waveform & Voice controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span>Encounter Audio Stream</span>
              <span className="font-mono text-foreground bg-secondary/80 px-2 py-0.5 rounded border border-border/40">
                {formatTime(durationSec)}
              </span>
            </div>

            {/* Canvas Waveform */}
            <Waveform isRecording={isRecording || isSimulating} />

            {/* Record Actions bar */}
            <div className="flex flex-wrap gap-3 items-center justify-between">
              {/* Simulation trigger */}
              <button
                onClick={simulateTranscription}
                disabled={isRecording || isSimulating}
                className="flex items-center gap-2 bg-secondary hover:bg-border text-foreground font-semibold px-4 py-2.5 rounded-xl border border-border transition text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Volume2 className="w-3.5 h-3.5 text-accent animate-pulse" />
                Simulate Conversation Stream
              </button>

              {/* Real Mic controls */}
              <div className="flex gap-2">
                {isRecording ? (
                  <button
                    onClick={stopRecording}
                    className="flex items-center gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold px-4 py-2.5 rounded-xl transition text-xs"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    Stop Rec
                  </button>
                ) : (
                  <button
                    onClick={startRecording}
                    disabled={isSimulating}
                    className="flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-4 py-2.5 rounded-xl transition text-xs shadow-md shadow-accent/25 disabled:opacity-50"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    Record Live Mic
                  </button>
                )}

                {(transcript || durationSec > 0) && (
                  <button
                    onClick={handleReset}
                    className="p-2.5 rounded-xl bg-secondary hover:bg-border text-muted-foreground hover:text-foreground border border-border transition"
                    title="Reset Scribe"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Real-Time Conversation Intelligence panel */}
          {transcript && (
            <div className="bg-secondary/40 border border-border/60 rounded-xl p-4 space-y-3 animate-fade-in text-xs">
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">
                Real-Time Conversation Intelligence
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-muted-foreground block text-[10px]">Extracted Symptoms:</span>
                  <div className="flex flex-wrap gap-1">
                    {rtIntel.symptoms.map((s, idx) => (
                      <span key={idx} className="bg-accent/15 text-accent border border-accent/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {s}
                      </span>
                    ))}
                    {rtIntel.symptoms.length === 0 && <span className="text-muted-foreground font-medium italic">Listening...</span>}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground block text-[10px]">Extracted Duration:</span>
                  <span className="font-bold text-foreground">
                    {rtIntel.duration || <span className="text-muted-foreground font-medium italic">Listening...</span>}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground block text-[10px]">Associated Signs:</span>
                  <span className="font-semibold text-foreground">
                    {rtIntel.associated.join(", ") || <span className="text-muted-foreground font-medium italic">Listening...</span>}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground block text-[10px]">Missing Information Checklist:</span>
                  <div className="flex flex-col gap-0.5 text-[10px]">
                    {rtIntel.missing.map((m, idx) => (
                      <span key={idx} className="text-amber-500 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                        {m}
                      </span>
                    ))}
                    {rtIntel.missing.length === 0 && <span className="text-emerald-500 font-bold">✓ Encounter complete</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Live Transcript output window */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Clinical Transcript (Editable)
            </label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="No clinical dialogue recorded yet. Speak via 'Record Live Mic' or run 'Simulate Conversation Stream' above..."
              className="w-full h-48 bg-secondary/30 border border-border/80 focus:border-accent rounded-2xl p-4 text-sm focus:outline-none leading-relaxed resize-none"
              disabled={isSimulating}
            />
          </div>

          {/* Process button */}
          <button
            onClick={generateClinicalDocumentation}
            disabled={!transcript || isRecording || isSimulating || isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90 font-bold py-3.5 rounded-xl transition shadow-lg shadow-accent/25 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            {isGenerating ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-accent-foreground border-t-transparent animate-spin"></span>
                Clinova AI Structuring & Auditing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Clinical Documentation
              </>
            )}
          </button>

        </div>

      </div>

      {/* ================= RIGHT COLUMN: DOCUMENTATION ENGINE ================= */}
      <div className="space-y-6">
        
        {/* AI Medical Knowledge Assistant Widget */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-accent" />
            AI Medical Knowledge Assistant
          </span>
          
          <div className="flex flex-wrap gap-2">
            <button 
              type="button"
              onClick={() => setActiveKnowledgeKey(activeKnowledgeKey === "cardio" ? null : "cardio")}
              className={`text-[10px] font-bold border px-3 py-1.5 rounded-lg transition ${
                activeKnowledgeKey === "cardio" ? "bg-accent text-accent-foreground border-accent" : "bg-secondary/40 text-muted-foreground border-border"
              }`}
            >
              Stable Angina Guidelines
            </button>
            <button 
              type="button"
              onClick={() => setActiveKnowledgeKey(activeKnowledgeKey === "hypertension" ? null : "hypertension")}
              className={`text-[10px] font-bold border px-3 py-1.5 rounded-lg transition ${
                activeKnowledgeKey === "hypertension" ? "bg-accent text-accent-foreground border-accent" : "bg-secondary/40 text-muted-foreground border-border"
              }`}
            >
              JNC8 Hypertension
            </button>
            <button 
              type="button"
              onClick={() => setActiveKnowledgeKey(activeKnowledgeKey === "asthma" ? null : "asthma")}
              className={`text-[10px] font-bold border px-3 py-1.5 rounded-lg transition ${
                activeKnowledgeKey === "asthma" ? "bg-accent text-accent-foreground border-accent" : "bg-secondary/40 text-muted-foreground border-border"
              }`}
            >
              Pediatric Asthma Control
            </button>
          </div>

          {activeKnowledgeKey && (
            <div className="bg-accent/5 p-4 rounded-xl border border-accent/15 text-xs animate-fade-in space-y-1.5 leading-relaxed">
              <h5 className="font-bold text-accent uppercase tracking-wider text-[10px]">
                {KNOWLEDGE_BASE[activeKnowledgeKey].title}
              </h5>
              <p className="text-muted-foreground text-xs">{KNOWLEDGE_BASE[activeKnowledgeKey].content}</p>
            </div>
          )}
        </div>

        {/* Tabs for Note Types */}
        <div className="flex border-b border-border bg-card/60 p-1.5 rounded-xl border">
          {(["SOAP", "PROGRESS", "CONSULTATION", "REFERRAL"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setNoteType(type)}
              className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                noteType === type
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {type} note
            </button>
          ))}
        </div>

        {/* Note Output Area */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm min-h-[400px] flex flex-col justify-between relative overflow-hidden">
          
          {!hasGenerated ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Documentation Preview</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                  Run the AI scribe transcription on the left, then click 'Generate Clinical Documentation' to view structured outputs here.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 flex-1">
              
              {/* Quality Audit Summary Ring & Alerts */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-secondary/40 p-4 rounded-xl border border-border/60">
                <div className="flex items-center gap-3">
                  <ScoreRing score={qualityScore} size={48} strokeWidth={4} />
                  <div>
                    <h4 className="text-xs font-bold">Documentation Completeness</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Audited by Clinova Compliance Engine
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-[11px]">
                  {qualityFeedback.warnings.map((w, i) => (
                    <span key={i} className="flex items-center gap-1.5 text-amber-500 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {w}
                    </span>
                  ))}
                  {qualityFeedback.warnings.length === 0 && (
                    <span className="flex items-center gap-1.5 text-emerald-500 font-semibold">
                      <FileCheck className="w-3.5 h-3.5" />
                      No critical warnings found.
                    </span>
                  )}
                </div>
              </div>

              {/* SOAP Note Form Fields */}
              {noteType === "SOAP" && (
                <div className="space-y-4 text-sm">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">Subjective (S)</span>
                    <textarea
                      value={soapSubjective}
                      onChange={(e) => setSoapSubjective(e.target.value)}
                      className="w-full h-24 bg-secondary/20 border border-border/80 focus:border-accent rounded-xl p-3 focus:outline-none leading-relaxed resize-none text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">Objective (O)</span>
                    <textarea
                      value={soapObjective}
                      onChange={(e) => setSoapObjective(e.target.value)}
                      className="w-full h-24 bg-secondary/20 border border-border/80 focus:border-accent rounded-xl p-3 focus:outline-none leading-relaxed resize-none text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">Assessment (A)</span>
                    <textarea
                      value={soapAssessment}
                      onChange={(e) => setSoapAssessment(e.target.value)}
                      className="w-full h-20 bg-secondary/20 border border-border/80 focus:border-accent rounded-xl p-3 focus:outline-none leading-relaxed resize-none text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">Plan (P)</span>
                    <textarea
                      value={soapPlan}
                      onChange={(e) => setSoapPlan(e.target.value)}
                      className="w-full h-24 bg-secondary/20 border border-border/80 focus:border-accent rounded-xl p-3 focus:outline-none leading-relaxed resize-none text-xs"
                    />
                  </div>
                </div>
              )}

              {/* PROGRESS NOTE Form Fields */}
              {noteType === "PROGRESS" && (
                <div className="space-y-2 text-sm">
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">Progress Note Details</span>
                  <textarea
                    value={progressContent}
                    onChange={(e) => setProgressContent(e.target.value)}
                    className="w-full h-72 bg-secondary/20 border border-border/80 focus:border-accent rounded-xl p-3 focus:outline-none leading-relaxed resize-none text-xs"
                  />
                </div>
              )}

              {/* CONSULTATION NOTE Form Fields */}
              {noteType === "CONSULTATION" && (
                <div className="space-y-2 text-sm">
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">Consultation Summary</span>
                  <textarea
                    value={consultationContent}
                    onChange={(e) => setConsultationContent(e.target.value)}
                    className="w-full h-72 bg-secondary/20 border border-border/80 focus:border-accent rounded-xl p-3 focus:outline-none leading-relaxed resize-none text-xs"
                  />
                </div>
              )}

              {/* REFERRAL NOTE Form Fields */}
              {noteType === "REFERRAL" && (
                <div className="space-y-4 text-sm">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">Recipient Doctor / Specialist</span>
                    <input
                      type="text"
                      value={referralRecipient}
                      onChange={(e) => setReferralRecipient(e.target.value)}
                      className="w-full bg-secondary/20 border border-border/80 focus:border-accent rounded-xl p-3 focus:outline-none text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-accent uppercase tracking-wider">Urgency Level</span>
                      <input
                        type="text"
                        value={referralUrgency}
                        onChange={(e) => setReferralUrgency(e.target.value)}
                        className="w-full bg-secondary/20 border border-border/80 focus:border-accent rounded-xl p-3 focus:outline-none text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-accent uppercase tracking-wider">Reason for Referral</span>
                      <input
                        type="text"
                        value={referralReason}
                        onChange={(e) => setReferralReason(e.target.value)}
                        className="w-full bg-secondary/20 border border-border/80 focus:border-accent rounded-xl p-3 focus:outline-none text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">Clinical History & Findings</span>
                    <textarea
                      value={referralHistory}
                      onChange={(e) => setReferralHistory(e.target.value)}
                      className="w-full h-36 bg-secondary/20 border border-border/80 focus:border-accent rounded-xl p-3 focus:outline-none leading-relaxed resize-none text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Suggestions Panel */}
              {qualityFeedback.suggestions.length > 0 && (
                <div className="p-4 bg-accent/5 rounded-xl border border-accent/10 space-y-2">
                  <h5 className="text-[11px] font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-accent" />
                    AI Optimization Suggestions
                  </h5>
                  <ul className="list-disc list-inside text-[11px] text-muted-foreground space-y-1">
                    {qualityFeedback.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Save Encounter Button */}
              <button
                onClick={handleSaveEncounter}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-emerald-500/10 text-xs mt-4"
              >
                {isSaving ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    Signing & Uploading to Patient EHR...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Accept & Sign Clinical Note
                  </>
                )}
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

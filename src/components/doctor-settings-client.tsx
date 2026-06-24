"use client";

import { useState } from "react";
import { Doctor } from "@/lib/db";
import { updateDoctorPreferencesAction } from "@/app/doctor/patients/actions";
import { 
  Save, 
  Check, 
  Brain, 
  HelpCircle, 
  ToggleLeft, 
  MessageSquare,
  FileSpreadsheet
} from "lucide-react";

interface DoctorSettingsClientProps {
  doctor: Doctor;
}

export default function DoctorSettingsClient({ doctor }: DoctorSettingsClientProps) {
  // Parse initial preferences
  let initialPrefs = {
    noteStyle: "short",
    showReviewAIPrompt: true,
    autoSave: true
  };
  try {
    initialPrefs = JSON.parse(doctor.preferences);
  } catch (e) {
    console.error("Failed to parse doctor preferences", e);
  }

  // Active configurations
  const [noteStyle, setNoteStyle] = useState<string>(initialPrefs.noteStyle || "short");
  const [showReviewAIPrompt, setShowReviewAIPrompt] = useState(
    initialPrefs.showReviewAIPrompt !== undefined ? initialPrefs.showReviewAIPrompt : true
  );
  const [autoSave, setAutoSave] = useState(
    initialPrefs.autoSave !== undefined ? initialPrefs.autoSave : true
  );
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Submit preferences to Server Action
  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setShowSuccess(false);

    const updatedJson = JSON.stringify({
      noteStyle,
      showReviewAIPrompt,
      autoSave
    });

    const res = await updateDoctorPreferencesAction(updatedJson);
    setIsSaving(false);
    
    if (res.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      alert("Error saving preferences: " + res.error);
    }
  };

  return (
    <form onSubmit={handleSavePreferences} className="space-y-6 max-w-2xl">
      
      {/* Settings Panel */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
        
        {/* Doctor Personal AI Memory Banner */}
        <div className="flex gap-4 p-4 bg-accent/5 rounded-xl border border-accent/15">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
            <Brain className="w-5 h-5 animate-pulse-ring" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">Doctor's Personal AI Memory</h4>
            <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
              Clinova AI adapts note formats, shorthand notation, and billing styles by listening to your edits. Configure your defaults below.
            </p>
          </div>
        </div>

        {/* Note Style Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
            Clinical Note length style
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Short Style */}
            <div 
              onClick={() => setNoteStyle("short")}
              className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition ${
                noteStyle === "short" 
                  ? "bg-accent/5 border-accent text-foreground shadow-sm" 
                  : "bg-secondary/30 border-border text-muted-foreground hover:border-border-hover"
              }`}
            >
              <div className="space-y-2">
                <span className="font-bold text-xs block text-foreground">Short Note</span>
                <p className="text-[10px] leading-relaxed">
                  Prepares bulleted summaries highlighting diagnostic metrics and urgent plans.
                </p>
              </div>
              <span className={`text-[9px] font-bold mt-3 block uppercase tracking-wider ${noteStyle === "short" ? "text-accent" : "text-muted-foreground"}`}>
                {noteStyle === "short" ? "✓ Selected" : "Select"}
              </span>
            </div>

            {/* Standard Style */}
            <div 
              onClick={() => setNoteStyle("standard")}
              className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition ${
                noteStyle === "standard" 
                  ? "bg-accent/5 border-accent text-foreground shadow-sm" 
                  : "bg-secondary/30 border-border text-muted-foreground hover:border-border-hover"
              }`}
            >
              <div className="space-y-2">
                <span className="font-bold text-xs block text-foreground">Standard SOAP</span>
                <p className="text-[10px] leading-relaxed">
                  Generates standard EHR clinical notes structured into complete SOAP paragraphs.
                </p>
              </div>
              <span className={`text-[9px] font-bold mt-3 block uppercase tracking-wider ${noteStyle === "standard" ? "text-accent" : "text-muted-foreground"}`}>
                {noteStyle === "standard" ? "✓ Selected" : "Select"}
              </span>
            </div>

            {/* Detailed Style */}
            <div 
              onClick={() => setNoteStyle("detailed")}
              className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition ${
                noteStyle === "detailed" 
                  ? "bg-accent/5 border-accent text-foreground shadow-sm" 
                  : "bg-secondary/30 border-border text-muted-foreground hover:border-border-hover"
              }`}
            >
              <div className="space-y-2">
                <span className="font-bold text-xs block text-foreground">Detailed Summary</span>
                <p className="text-[10px] leading-relaxed">
                  Comprehensive review with detailed patient education summaries and code mapping.
                </p>
              </div>
              <span className={`text-[9px] font-bold mt-3 block uppercase tracking-wider ${noteStyle === "detailed" ? "text-accent" : "text-muted-foreground"}`}>
                {noteStyle === "detailed" ? "✓ Selected" : "Select"}
              </span>
            </div>

          </div>
        </div>

        <hr className="border-border/50" />

        {/* Workflow settings checklist */}
        <div className="space-y-4">
          <label className="block text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
            Automated Scribe Workflows
          </label>
          
          <div className="space-y-3">
            {/* Auto compliance checks */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={showReviewAIPrompt}
                onChange={(e) => setShowReviewAIPrompt(e.target.checked)}
                className="mt-0.5 rounded border-border text-accent focus:ring-accent bg-secondary"
              />
              <div className="text-xs">
                <span className="font-bold text-foreground block group-hover:text-accent transition">
                  Run AI Quality Auditing
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Check documentation for missing info (medication dose, warning signs) before signing.
                </span>
              </div>
            </label>

            {/* Autosave transcript */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="mt-0.5 rounded border-border text-accent focus:ring-accent bg-secondary"
              />
              <div className="text-xs">
                <span className="font-bold text-foreground block group-hover:text-accent transition">
                  Autosave Dictation Transcripts
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Keep temporary audio logs in local database workspace for quick restoration.
                </span>
              </div>
            </label>
          </div>
        </div>

      </div>

      {/* Success Notification Alert */}
      {showSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold rounded-xl animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          Settings successfully saved and synced to Clinova Cloud!
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSaving}
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-accent text-accent-foreground font-bold px-6 py-3.5 rounded-xl transition hover:bg-accent/90 shadow-md shadow-accent/20 text-xs disabled:opacity-50"
      >
        {isSaving ? (
          "Saving Preferences..."
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save AI Memory Preferences
          </>
        )}
      </button>

    </form>
  );
}

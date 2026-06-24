"use client";

import { useState } from "react";
import { 
  GitBranch, 
  Play, 
  Settings, 
  Save, 
  Check, 
  Mail, 
  Calendar, 
  Plus, 
  UserPlus,
  Sparkles,
  ArrowRight,
  Workflow
} from "lucide-react";

interface WorkflowRule {
  id: string;
  name: string;
  trigger: string;
  actions: { name: string; desc: string; active: boolean }[];
  active: boolean;
}

export default function WorkflowsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [rules, setRules] = useState<WorkflowRule[]>([
    {
      id: "rule-encounter-complete",
      name: "Encounter Signed Automation",
      trigger: "Encounter Completed / Signed",
      active: true,
      actions: [
        { name: "Create SOAP Note Draft", desc: "Generate structured SOAP elements automatically.", active: true },
        { name: "Generate Plain English Summary", desc: "AI-translate medical jargon for patients.", active: true },
        { name: "Publish to Patient Portal", desc: "Post the summary to the secure patient messaging feed.", active: true },
        { name: "Schedule Follow-up Tasks", desc: "Set automatic reminders on Day 7, Day 30, and Day 90.", active: true },
        { name: "Generate Specialist Referral Sheet", desc: "Draft a cardiology or dermal referral letter automatically.", active: false }
      ]
    },
    {
      id: "rule-patient-onboard",
      name: "New Patient Onboarding Rule",
      trigger: "Patient Record Registered",
      active: false,
      actions: [
        { name: "Pre-Populate Family History", desc: "AI queries previous clinics for cardiovascular histories.", active: true },
        { name: "Verify Allergy Profiles", desc: "Analyze drug allergy databases for flags.", active: true },
        { name: "Welcome Portal Invites", desc: "Send secure portal invitation SMS and email.", active: false }
      ]
    }
  ]);

  const toggleAction = (ruleId: string, actionName: string) => {
    setRules(rules.map((rule) => {
      if (rule.id !== ruleId) return rule;
      return {
        ...rule,
        actions: rule.actions.map((act) => {
          if (act.name !== actionName) return act;
          return { ...act, active: !act.active };
        })
      };
    }));
  };

  const toggleRule = (ruleId: string) => {
    setRules(rules.map((rule) => {
      if (rule.id !== ruleId) return rule;
      return { ...rule, active: !rule.active };
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-accent to-accent bg-clip-text text-transparent">
            AI Workflow Builder
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Build automated clinical pipelines by triggering note summaries, portal messages, and follow-up reviews.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-accent text-accent-foreground font-bold px-5 rounded-xl transition hover:bg-accent/90 shadow-md shadow-accent/15 text-xs shrink-0 w-full sm:w-auto h-11"
        >
          {isSaving ? (
            "Saving automation..."
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Workflows
            </>
          )}
        </button>
      </div>

      <hr className="border-border/50" />

      {/* Success Notification */}
      {showSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold rounded-xl animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          Workflow automation rules updated and compiled successfully!
        </div>
      )}

      {/* Pipeline builder cards */}
      <div className="space-y-8">
        {rules.map((rule) => (
          <div 
            key={rule.id}
            className={`bg-card border rounded-2xl p-6 shadow-sm space-y-6 relative ${
              rule.active ? "border-accent/40" : "border-border opacity-70"
            }`}
          >
            {/* Rule Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  rule.active ? "bg-accent/15 text-accent" : "bg-secondary text-muted-foreground"
                }`}>
                  <GitBranch className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{rule.name}</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Triggered when: <strong className="text-foreground">{rule.trigger}</strong>
                  </p>
                </div>
              </div>

              {/* Status Toggle */}
              <button
                onClick={() => toggleRule(rule.id)}
                className={`text-xs font-bold px-4 rounded-lg border transition h-10 flex items-center justify-center shrink-0 w-full sm:w-auto ${
                  rule.active 
                    ? "bg-accent text-accent-foreground border-accent" 
                    : "bg-secondary text-muted-foreground border-border"
                }`}
              >
                {rule.active ? "Active Rule" : "Paused"}
              </button>
            </div>

            {/* Pipeline Visual Flow */}
            {rule.active && (
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                  Clinical Pipeline Nodes
                </span>

                <div className="flex flex-col gap-3">
                  {rule.actions.map((act, index) => (
                    <div 
                      key={act.name}
                      onClick={() => toggleAction(rule.id, act.name)}
                      className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition ${
                        act.active 
                          ? "bg-accent/5 border-accent/30 text-foreground" 
                          : "bg-secondary/30 border-border/60 text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                          act.active ? "bg-accent text-accent-foreground border-accent" : "bg-secondary text-muted-foreground border-border"
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-foreground">{act.name}</h4>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{act.desc}</p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        act.active ? "text-accent" : "text-muted-foreground"
                      }`}>
                        {act.active ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}

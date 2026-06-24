"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, Search, Sparkles, AlertCircle } from "lucide-react";

export default function VoiceCommandBar() {
  const router = useRouter();
  const [command, setCommand] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);

  const commandPresets = [
    { text: "Open John Doe's chart", route: "/doctor/patients/patient-1" },
    { text: "Start cardiology scribe", route: "/doctor/scribe" },
    { text: "Open clinical templates", route: "/doctor/templates" },
    { text: "Open billing analytics", route: "/admin" },
  ];

  const handleExecute = (cmdText: string) => {
    const cleanCmd = cmdText.trim().toLowerCase();
    setCommand(cmdText);
    setStatus(`Executing: "${cmdText}"...`);
    setShowPresets(false);

    setTimeout(() => {
      if (cleanCmd.includes("john") || cleanCmd.includes("chart")) {
        router.push("/doctor/patients/patient-1");
        setStatus("Redirecting to John Doe's chart");
      } else if (cleanCmd.includes("cardiology") || cleanCmd.includes("scribe")) {
        router.push("/doctor/scribe");
        setStatus("Loading Cardiology Scribe Workspace");
      } else if (cleanCmd.includes("template")) {
        router.push("/doctor/templates");
        setStatus("Opening Clinical Templates Catalog");
      } else if (cleanCmd.includes("billing") || cleanCmd.includes("admin") || cleanCmd.includes("analytics")) {
        router.push("/admin");
        setStatus("Opening Compliance Analytics Hub");
      } else {
        setStatus("Command not recognized. Try: 'Open John Doe'");
      }
      setTimeout(() => setStatus(null), 3000);
    }, 800);
  };

  const handleVoiceClick = () => {
    // Simulate dictation
    setStatus("Listening for command...");
    setTimeout(() => {
      // Pick a random preset
      const randomPreset = commandPresets[Math.floor(Math.random() * commandPresets.length)];
      handleExecute(randomPreset.text);
    }, 1500);
  };

  return (
    <div className="relative flex-1 max-w-[140px] sm:max-w-xs md:max-w-md">
      <div className="flex items-center gap-2 bg-secondary/50 border border-border/80 rounded-xl px-3 py-1.5 focus-within:ring-1 focus-within:ring-accent transition">
        <button
          onClick={handleVoiceClick}
          className="p-1 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent transition"
          title="Simulate Voice Command"
        >
          <Mic className="w-3.5 h-3.5" />
        </button>
        
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onFocus={() => setShowPresets(true)}
          onBlur={() => setTimeout(() => setShowPresets(false), 200)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleExecute(command);
          }}
          placeholder="Dictate or type command (e.g. 'Open John Doe')..."
          className="w-full text-xs bg-transparent border-none focus:outline-none text-foreground"
        />
        
        <Sparkles className="w-3.5 h-3.5 text-accent/60" />
      </div>

      {/* Preset List Dropdown */}
      {showPresets && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg p-2 z-50 animate-fade-in text-left">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1 block">
            Suggested Voice Commands
          </span>
          <div className="space-y-1 mt-1">
            {commandPresets.map((preset, index) => (
              <button
                key={index}
                onClick={() => handleExecute(preset.text)}
                className="w-full text-left text-xs text-foreground hover:bg-secondary/80 px-2 py-1.5 rounded-lg transition flex items-center justify-between"
              >
                <span>{preset.text}</span>
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Status Overlay */}
      {status && (
        <div className="absolute top-full left-0 mt-2 bg-secondary border border-accent/20 text-accent font-semibold text-[10px] px-3 py-1 rounded-full flex items-center gap-1.5 shadow z-50">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping"></span>
          {status}
        </div>
      )}
    </div>
  );
}

// Inline helper icon import since we used it
function ChevronRight(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );
}

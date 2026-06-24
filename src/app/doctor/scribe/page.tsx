import db from "@/lib/db";
import Link from "next/link";
import { Mic, Users, ArrowRight, UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default function StandaloneScribePage() {
  // Query patient listings to offer directory shortcuts
  const patients = db.patients.findMany();

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* OS Guidance Banner */}
      <div className="bg-gradient-to-br from-accent/15 via-primary/5 to-transparent border border-accent/25 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-24 h-full bg-accent/5 filter blur-2xl"></div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/25 flex items-center justify-center text-accent ring-2 ring-accent/20">
            <Mic className="w-6 h-6 animate-pulse-ring" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">AI Clinical Operating System Workspace</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              Clinova AI operates directly inside the patient's EHR file. Selecting a patient directory below opens their visual chart timeline, indexes past notes, and launches the live scribe mic inline without switching routes.
            </p>
          </div>
        </div>
      </div>

      <hr className="border-border/50" />

      {/* Patients Shortcut Selector */}
      <div className="space-y-4">
        <h4 className="font-bold text-base tracking-tight flex items-center gap-2 text-foreground">
          <Users className="w-5 h-5 text-accent" />
          Select Active Patient Chart to Start Scribing
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((p) => {
            const age = Math.abs(new Date(Date.now() - new Date(p.dob).getTime()).getUTCFullYear() - 1970);
            
            return (
              <div 
                key={p.id}
                className="bg-card border border-border hover:border-accent/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition group relative"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full rounded-l-2xl bg-accent/10 group-hover:bg-accent transition-colors"></div>
                
                <div className="space-y-3 pl-2">
                  <div>
                    <h5 className="font-bold text-sm text-foreground">{p.name}</h5>
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">
                      {p.gender} • Age {age}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 bg-secondary/30 p-2.5 rounded-lg border border-border/40 leading-relaxed">
                    History: {p.medicalHistory || "None logged."}
                  </p>
                </div>

                <Link
                  href={`/doctor/patients/${p.id}?scribe=true`}
                  className="mt-6 flex items-center justify-center gap-1 bg-accent text-accent-foreground font-bold rounded-xl transition hover:bg-accent/90 text-xs shadow-md shadow-accent/15 h-11"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Open Chart & Start Scribe
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

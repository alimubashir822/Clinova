import Link from "next/link";
import { Stethoscope, User, ShieldCheck, Activity, Brain } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/15 via-background to-background flex flex-col justify-between p-8 relative overflow-hidden">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/5 filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 filter blur-3xl pointer-events-none"></div>

      {/* Brand Header */}
      <header className="flex items-center justify-between max-w-6xl mx-auto w-full z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent ring-2 ring-accent/20">
            <Stethoscope className="w-6 h-6 animate-pulse-ring" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-foreground via-accent to-accent bg-clip-text text-transparent">
              Clinova AI
            </span>
            <span className="text-[10px] bg-accent/10 text-accent font-semibold px-2 py-0.5 rounded-full ml-2 border border-accent/20">
              v1.0.0-beta
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          HIPAA COMPLIANT
        </div>
      </header>

      {/* Main Body Grid */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full z-10 py-12">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 bg-secondary text-accent font-semibold px-3.5 py-1.5 rounded-full text-xs border border-border/80">
            <Brain className="w-3.5 h-3.5 animate-bounce" />
            AI Clinical Workflow Assistant
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Turn Medical Conversations Into <br />
            <span className="bg-gradient-to-r from-accent via-teal-400 to-indigo-400 bg-clip-text text-transparent">
              Structured Documentation
            </span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Clinova AI listens, structures, summarizes, and prepares clinical notes, histories, and specialty-specific letters in real-time, reducing doctor workloads.
          </p>
        </div>

        {/* Portal Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          
          {/* Card 1: Doctor Workspace */}
          <div className="bg-card hover:bg-card/80 border border-border hover:border-accent/40 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 shadow-md group relative hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Doctor Workspace</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Log in as <strong>Dr. Sarah Jenkins</strong> to record patient consultations, generate SOAP notes, review timelines, check documentation quality, and write patient reports.
              </p>
            </div>
            <Link
              href="/doctor/dashboard"
              className="mt-8 flex items-center justify-center bg-accent text-accent-foreground font-semibold py-3 px-4 rounded-xl transition hover:bg-accent/90 shadow-md shadow-accent/20 text-sm"
            >
              Enter Doctor Workspace
            </Link>
          </div>

          {/* Card 2: Admin Dashboard */}
          <div className="bg-card hover:bg-card/80 border border-border hover:border-primary/40 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 shadow-md group relative hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Admin Portal</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Access the clinical manager dashboard. Review doctor usage analytics, AI minutes consumed, audit compliance logs, and organization settings.
              </p>
            </div>
            <Link
              href="/admin"
              className="mt-8 flex items-center justify-center bg-secondary hover:bg-border text-foreground border border-border font-semibold py-3 px-4 rounded-xl transition text-sm"
            >
              Enter Admin Portal
            </Link>
          </div>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-6xl mx-auto w-full text-center text-[10px] text-muted-foreground shrink-0 z-10 mt-8 border-t border-border/40 pt-4 flex flex-col md:flex-row justify-between items-center gap-2">
        <p>© 2026 Clinova AI Inc. All rights reserved. • <a href="https://www.medclinicx.com/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition font-semibold">Healthcare system by Med Clinic X</a></p>
        <p className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-ping"></span>
          Running Local SQLite Sandbox (db.json persistent database)
        </p>
      </footer>
    </div>
  );
}

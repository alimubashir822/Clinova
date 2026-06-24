import Link from "next/link";
import { ShieldCheck, Stethoscope, ArrowLeft } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Admin Header Bar */}
      <header className="h-16 border-b border-border bg-card/60 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary ring-2 ring-primary/20">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-foreground">
              Clinova AI Compliance & Admin Portal
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
              Organization Health Network
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            COMPLIANCE AUDIT ACTIVE
          </div>

          <Link
            href="/doctor/dashboard"
            className="flex items-center gap-1 bg-secondary hover:bg-border text-xs font-semibold px-3 py-1.5 rounded-lg border border-border/80 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Doctor Workspace
          </Link>
        </div>
      </header>

      {/* Admin Content Area */}
      <main className="flex-1 p-8 bg-background max-w-7xl mx-auto w-full space-y-8 flex flex-col justify-between">
        <div className="flex-1 w-full pb-8">
          {children}
        </div>

        <footer className="w-full text-center text-[10px] text-muted-foreground shrink-0 mt-8 border-t border-border/40 pt-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p>© 2026 Clinova AI Inc. All rights reserved. • <a href="https://www.medclinicx.com/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition font-semibold">Healthcare system by Med Clinic X</a></p>
          <p className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Compliance Database Logged
          </p>
        </footer>
      </main>
    </div>
  );
}

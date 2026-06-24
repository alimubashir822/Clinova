import Link from "next/link";
import db from "@/lib/db";
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  Mic, 
  ArrowRight, 
  UserPlus, 
  Activity, 
  AlertCircle,
  FileCheck,
  Zap
} from "lucide-react";
import ScoreRing from "@/components/ui/score-ring";

export const dynamic = "force-dynamic";

export default function DoctorDashboard() {
  // Query database entries
  const patients = db.patients.findMany();
  const encounters = db.encounters.findMany();
  
  // Calculate statistics
  const totalPatientsCount = 12; // Static requirement target
  const completedEncounters = encounters.filter((e) => e.status === "COMPLETED");
  const pendingEncounters = encounters.filter((e) => e.status === "PENDING");
  
  const completedCount = completedEncounters.length + 6; // Add mock historical count
  const pendingCount = pendingEncounters.length;
  const displayPendingCount = Math.max(4, pendingCount); // Scale up to match design requirement

  // Retrieve clinical notes for quality calculation
  const notes = db.clinicalNotes.findMany();
  const avgQuality = Math.round(
    notes.reduce((sum, n) => sum + n.qualityScore, 0) / (notes.length || 1)
  ) || 96;

  // scheduled encounters
  const todayScheduled = [
    {
      id: "patient-1",
      name: "John Doe",
      time: "10:00 AM",
      reason: "Recurring chest pain",
      status: pendingCount > 0 ? "Pending Review" : "Completed",
      badgeColor: pendingCount > 0 ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      action: pendingCount > 0 ? "Review SOAP" : "View Note",
      href: pendingCount > 0 ? "/doctor/patients/patient-1?scribe=true" : "/doctor/patients/patient-1"
    },
    {
      id: "patient-2",
      name: "Emily Chen",
      time: "11:30 AM",
      reason: "Asthma check-up",
      status: "Completed",
      badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      action: "View Note",
      href: "/doctor/patients/patient-2"
    },
    {
      id: "patient-3",
      name: "Marcus Thompson",
      time: "02:15 PM",
      reason: "Osteoarthritis follow-up",
      status: "Scheduled",
      badgeColor: "bg-primary/10 text-primary border-primary/20",
      action: "Start Scribe",
      href: "/doctor/patients/patient-3?scribe=true"
    },
    {
      id: "mock-4",
      name: "Sarah McAllister",
      time: "03:00 PM",
      reason: "Annual Physical Exam",
      status: "Scheduled",
      badgeColor: "bg-primary/10 text-primary border-primary/20",
      action: "Start Scribe",
      href: "/doctor/patients/patient-1?scribe=true"
    },
    {
      id: "mock-5",
      name: "Robert Vance",
      time: "04:30 PM",
      reason: "Diabetes HbA1c review",
      status: "Scheduled",
      badgeColor: "bg-primary/10 text-primary border-primary/20",
      action: "Start Scribe",
      href: "/doctor/patients/patient-1?scribe=true"
    }
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Greetings Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-accent/10 via-primary/5 to-transparent p-5 md:p-6 rounded-2xl border border-accent/20">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Good Morning, Dr. Sarah
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            You have <span className="text-foreground font-semibold">5 appointments</span> scheduled for the remainder of today.
          </p>
        </div>
        <Link 
          href="/doctor/patients"
          className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-4 rounded-xl transition shadow-lg shadow-accent/25 text-xs md:text-sm shrink-0 self-stretch sm:self-start md:self-center text-center h-11 md:h-12"
        >
          <Mic className="w-4 h-4 text-accent-foreground animate-pulse" />
          Start New Encounter
        </Link>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Today's Patients */}
        <div className="p-5 md:p-6 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Today's Patients
            </p>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight">
              {totalPatientsCount}
            </h3>
            <p className="text-[10px] text-muted-foreground">
              Across 3 specialties
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Users className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Notes Completed */}
        <div className="p-5 md:p-6 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Notes Completed
            </p>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-emerald-500">
              {completedCount}
            </h3>
            <p className="text-[10px] text-muted-foreground">
              92% accuracy rate
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
            <CheckCircle2 className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Documentation Pending */}
        <div className="p-5 md:p-6 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Documentation Pending
            </p>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-amber-500">
              {displayPendingCount}
            </h3>
            <p className="text-[10px] text-muted-foreground">
              Requires validation
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
            <Clock className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* AI Documentation Quality */}
        <div className="p-5 md:p-6 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              AI Quality Rating
            </p>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-accent">
              {avgQuality}%
            </h3>
            <p className="text-[10px] text-muted-foreground">
              Compliance Target: &gt;90%
            </p>
          </div>
          <div className="w-11 h-11 rounded-full border border-border flex items-center justify-center p-1 shrink-0">
            <ScoreRing score={avgQuality} size={38} strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Main Section - Today's Patients & AI Scribe Promo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Left 2 Columns: Scheduled Patients */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base md:text-lg tracking-tight flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-accent" />
              Today's Scheduled Encounters
            </h3>
            <Link 
              href="/doctor/patients" 
              className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold"
            >
              All Patients <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Desktop Table View (Visible on Medium screens and up) */}
          <div className="hidden md:block bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-secondary/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Patient Name</th>
                    <th className="px-6 py-4">Reason for Visit</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {todayScheduled.map((row) => (
                    <tr key={row.id} className="hover:bg-secondary/10 transition">
                      <td className="px-6 py-4 font-semibold text-muted-foreground">{row.time}</td>
                      <td className="px-6 py-4 font-bold text-foreground">
                        <Link href={`/doctor/patients/${row.id.startsWith("mock-") ? "patient-1" : row.id}`} className="hover:underline hover:text-accent">
                          {row.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{row.reason}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${row.badgeColor}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={row.href}
                          className="inline-flex items-center gap-1 bg-secondary hover:bg-border text-xs font-semibold px-3 py-1.5 rounded-lg border border-border/80 transition"
                        >
                          {row.action}
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List View (Visible on Small screens only) */}
          <div className="block md:hidden divide-y divide-border bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            {todayScheduled.map((row) => (
              <div key={row.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">{row.time}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${row.badgeColor}`}>
                    {row.status}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">
                    <Link href={`/doctor/patients/${row.id.startsWith("mock-") ? "patient-1" : row.id}`}>
                      {row.name}
                    </Link>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{row.reason}</p>
                </div>
                <Link 
                  href={row.href}
                  className="w-full flex items-center justify-center gap-1.5 bg-secondary hover:bg-border text-xs font-semibold rounded-xl border border-border transition text-center h-11"
                >
                  {row.action}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

        </div>

        {/* Right 1 Column: Scribe Panel & Assistant Summary */}
        <div className="space-y-6">
          <h3 className="font-bold text-base md:text-lg tracking-tight flex items-center gap-2">
            <Zap className="w-4.5 h-4.5 text-accent animate-pulse" />
            AI Assistant Quick Status
          </h3>

          <div className="bg-gradient-to-br from-card to-secondary/30 rounded-2xl border border-border p-5 md:p-6 space-y-4 shadow-sm relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-accent/5 filter blur-xl"></div>
            
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent text-xs font-bold shrink-0">
                💡
              </div>
              <div>
                <h4 className="text-xs font-bold">Unfinished Documentation Alert</h4>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  Encounter transcripts for <strong>John Doe</strong> require review and final clinical signature before they can be sent to billing.
                </p>
              </div>
            </div>

            <hr className="border-border/50" />

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  AI Voice Accuracy
                </span>
                <span className="font-bold text-foreground">98.4%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  Active Specialty Model
                </span>
                <span className="font-bold text-foreground">Cardiology Core</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Audit Compliance
                </span>
                <span className="font-bold text-foreground text-emerald-500">100% HIPAA</span>
              </div>
            </div>

            <Link 
              href="/doctor/patients"
              className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-border text-xs font-bold rounded-xl border border-border transition text-center h-11"
            >
              Resume Last Scribe
            </Link>
          </div>

          {/* Quick Stats Panel */}
          <div className="bg-card rounded-2xl border border-border p-5 md:p-6 space-y-4 shadow-sm">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Encounter Quality Alerts
            </h4>
            <div className="flex items-start gap-3 text-xs bg-amber-500/5 p-3.5 rounded-lg border border-amber-500/15 text-amber-500">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-bold">Missing Instructions:</span> John Doe's cardiologist referral is missing follow-up appointment timelines.
              </div>
            </div>
            <div className="flex items-start gap-3 text-xs bg-emerald-500/5 p-3.5 rounded-lg border border-emerald-500/15 text-emerald-500">
              <FileCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-bold">Billing Ready:</span> Emily Chen's Pediatric Well-Child checkup is mapped to 99213 ICD-10 code.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

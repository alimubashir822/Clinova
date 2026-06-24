import db from "@/lib/db";
import Link from "next/link";
import { 
  FileText, 
  Search, 
  Filter, 
  ArrowUpRight, 
  FolderOpen, 
  ExternalLink,
  Calendar
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function ReportsArchivePage() {
  // Query all reports and patients to perform a lightweight join
  const reports = db.reports.findMany().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const patients = db.patients.findMany();

  // Helper to map patient ID to patient name
  const getPatientName = (patientId: string) => {
    const p = patients.find((pat) => pat.id === patientId);
    return p ? p.name : "Unknown Patient";
  };

  // Label tags helper
  const getReportBadge = (type: string) => {
    switch (type) {
      case "VISIT_SUMMARY":
        return "bg-accent/15 text-accent border-accent/20";
      case "PATIENT_INSTRUCTIONS":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "REFERRAL_REPORT":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      default:
        return "bg-secondary text-muted-foreground border-border/80";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-accent to-accent bg-clip-text text-transparent">
          Reports Archive
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Historical repository of AI-generated visit summaries, patient guides, and referral files.
        </p>
      </div>

      <hr className="border-border/50" />

      {/* Reports Directory */}
      {reports.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground space-y-4">
          <FolderOpen className="w-12 h-12 text-muted-foreground/60 mx-auto" />
          <h4 className="font-bold text-sm">No reports archived yet</h4>
          <p className="text-xs text-muted-foreground/80 max-w-xs mx-auto">
            Once you translate encounters into patient version summaries, they will appear in this clinical repository.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <div 
              key={report.id} 
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:border-accent/40 transition flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-sm tracking-tight text-foreground line-clamp-1">
                      {report.title}
                    </h3>
                    <Link 
                      href={`/doctor/patients/${report.patientId}`}
                      className="text-xs text-accent hover:underline font-semibold mt-1 inline-block"
                    >
                      Patient Chart: {getPatientName(report.patientId)}
                    </Link>
                  </div>
                  <span className={`text-[9px] border font-bold px-2 py-0.5 rounded-full uppercase shrink-0 tracking-wider ${getReportBadge(report.type)}`}>
                    {report.type.replace("_", " ")}
                  </span>
                </div>

                <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 text-xs text-muted-foreground leading-relaxed font-sans max-h-32 overflow-y-auto whitespace-pre-wrap">
                  {report.content}
                </div>
              </div>

              <div className="pt-4 border-t border-border/40 mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  Generated: {new Date(report.createdAt).toLocaleDateString()}
                </span>
                
                <button
                  onClick={() => alert(`${report.title}\n\n${report.content}`)}
                  className="text-accent hover:underline font-bold text-xs flex items-center gap-1"
                >
                  Open Document
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

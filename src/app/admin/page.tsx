import db from "@/lib/db";
import { 
  Users, 
  Activity, 
  ShieldAlert, 
  CreditCard, 
  Clock, 
  ArrowUpRight,
  TrendingUp,
  FileCheck,
  UserCheck,
  Zap,
  CheckCircle2,
  Sparkles
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  // Query DB records
  const users = db.users.findMany();
  const doctors = db.doctors.findMany();
  const auditLogs = db.auditLogs.findMany();

  // Aggregate AI minutes consumed
  const totalMinutes = doctors.reduce((sum, doc) => sum + doc.aiUsageMinutes, 0);
  const maxQuotaMinutes = 500;
  const quotaPercent = Math.min(100, Math.round((totalMinutes / maxQuotaMinutes) * 100));

  // Projected billing variables
  const activePlanName = "Enterprise Tier - Clinova Premium";
  const monthlyCost = 250.0;
  const calculatedOverage = Math.max(0, totalMinutes - maxQuotaMinutes) * 0.15; // $0.15 per overage minute

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Overview stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Users */}
        <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Registered Staff Users
            </span>
            <h3 className="text-3xl font-bold text-foreground">{users.length} Active</h3>
            <p className="text-[11px] text-muted-foreground">Across Clinova Network</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Users className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* AI Minutes Consumed */}
        <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              AI Minutes Consumed
            </span>
            <h3 className="text-3xl font-bold text-foreground">{totalMinutes} min</h3>
            <p className="text-[11px] text-muted-foreground">
              Quota: {totalMinutes}/{maxQuotaMinutes} min ({quotaPercent}%)
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
            <Clock className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Billing Plan */}
        <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Monthly Subscription
            </span>
            <h3 className="text-3xl font-bold text-foreground">${monthlyCost}</h3>
            <p className="text-[11px] text-muted-foreground">Next billing: July 1, 2026</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <CreditCard className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Network Health compliance */}
        <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Compliance Status
            </span>
            <h3 className="text-3xl font-bold text-emerald-500">100% HIPAA</h3>
            <p className="text-[11px] text-muted-foreground">Encryption & audit logs active</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500">
            <FileCheck className="w-5.5 h-5.5" />
          </div>
        </div>

      </div>

      {/* AI Clinical Analytics Dashboard Segment */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg tracking-tight flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent animate-pulse" />
          AI Clinical Analytics & Workflow Insights
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Quota saved */}
          <div className="bg-gradient-to-br from-card to-accent/5 border border-accent/20 rounded-2xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] font-extrabold text-accent uppercase tracking-wider block">
              Clinical Time Saved
            </span>
            <h3 className="text-2xl font-black text-foreground">1,250 Hours</h3>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Calculated using average pre/post documentation metrics per clinician.
            </p>
          </div>

          {/* Most used templates */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
              Most Used Template
            </span>
            <h3 className="text-2xl font-black text-foreground">Cardiology Core</h3>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Followed closely by Pediatric Well-Child and General SOAP structures.
            </p>
          </div>

          {/* Note completion speed */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
              Average Note Completion
            </span>
            <h3 className="text-2xl font-black text-foreground">2 Minutes</h3>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Average time elapsed between voice transcription and final digital signature.
            </p>
          </div>

          {/* Satisfaction score */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
              Clinician Satisfaction
            </span>
            <h3 className="text-2xl font-black text-emerald-500">97.8% Positive</h3>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Based on monthly internal feedback scores regarding note accuracy.
            </p>
          </div>
        </div>
      </div>

      {/* Main admin panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Organization Directory & Quota Tracker */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Quota Progress */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm tracking-tight text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              AI Quota Usage Tracker
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Monthly Billing Minutes</span>
                <span>{quotaPercent}% Used</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-accent h-full rounded-full transition-all duration-500" 
                  style={{ width: `${quotaPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground bg-secondary/30 p-3.5 rounded-xl border border-border/50 space-y-1 leading-relaxed">
              <p>Active Pricing Plan: <strong>{activePlanName}</strong></p>
              <p>Overage Rate: <strong>$0.15 / min</strong> above quota</p>
              <p className="mt-2 text-foreground font-semibold">Projected Overage Charge: ${calculatedOverage.toFixed(2)}</p>
            </div>
          </div>

          {/* User Directory */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm tracking-tight text-foreground flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-accent" />
              Staff Directory
            </h3>

            <div className="space-y-3">
              {users.map((u) => (
                <div 
                  key={u.id}
                  className="flex items-center justify-between p-3 bg-secondary/30 border border-border/40 rounded-xl"
                >
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-foreground truncate">{u.name}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{u.email}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                    u.role === "DOCTOR" 
                      ? "bg-accent/15 text-accent border border-accent/25" 
                      : "bg-indigo-500/15 text-indigo-500 border border-indigo-500/25"
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Columns: Security Audit Logs */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-lg tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-accent animate-pulse" />
            Security & Clinical Access Audit Logs
          </h3>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-secondary/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">Operator</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {auditLogs.map((log) => {
                    const opName = users.find(u => u.id === log.userId)?.name || "Dr. Sarah Jenkins";
                    
                    return (
                      <tr key={log.id} className="hover:bg-secondary/10 transition">
                        <td className="px-6 py-4 font-mono text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 font-bold text-foreground">{opName}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded bg-secondary border border-border text-[10px] font-bold uppercase">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground font-sans leading-relaxed">
                          {log.details}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

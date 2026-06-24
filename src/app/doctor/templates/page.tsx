import db from "@/lib/db";
import { 
  FileText, 
  Search, 
  Heart, 
  Stethoscope, 
  Smile, 
  User, 
  Scissors, 
  Layers,
  Plus
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function TemplatesPage() {
  // Query all system and custom clinical templates
  const templates = db.templates.findMany();

  // Map specialty names to specific icon styles
  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty.toLowerCase()) {
      case "cardiology":
        return <Heart className="w-5 h-5 text-red-500" />;
      case "pediatrics":
        return <User className="w-5 h-5 text-indigo-500" />;
      case "dermatology":
        return <Scissors className="w-5 h-5 text-pink-500" />;
      case "dental":
        return <Smile className="w-5 h-5 text-amber-500" />;
      default:
        return <Stethoscope className="w-5 h-5 text-accent" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-accent to-accent bg-clip-text text-transparent">
            Clinical Note Templates
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Browse and configure structural fields for the AI documentation engine.
          </p>
        </div>
        <button
          onClick={() => alert("Custom templates configuration will be activated in Phase 2 production rollout.")}
          className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 rounded-xl transition text-xs shadow-md shadow-accent/25 shrink-0 w-full sm:w-auto h-11"
        >
          <Plus className="w-4 h-4" />
          Create Custom Template
        </button>
      </div>

      <hr className="border-border/50" />

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((temp) => {
          let parsedStructure: { fields: { name: string; id: string; placeholder: string }[] } = { fields: [] };
          try {
            parsedStructure = JSON.parse(temp.structure);
          } catch (e) {
            console.error("Failed to parse template structure", e);
          }

          return (
            <div 
              key={temp.id} 
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:border-accent/40 transition flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      {getSpecialtyIcon(temp.specialty)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm tracking-tight text-foreground">{temp.name}</h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{temp.specialty} Department</p>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    System
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Structured Prompt Parameters
                  </span>
                  <div className="space-y-1.5 bg-secondary/30 p-4 rounded-xl border border-border/40 text-xs">
                    {parsedStructure.fields.map((field) => (
                      <div key={field.id} className="flex items-start gap-2">
                        <span className="font-semibold text-accent shrink-0 select-none">•</span>
                        <div>
                          <span className="font-bold text-foreground block">{field.name}</span>
                          <span className="text-[10px] text-muted-foreground line-clamp-1">{field.placeholder}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/40 mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>Updated Jun 2026</span>
                <span className="text-accent font-semibold flex items-center gap-0.5 cursor-pointer hover:underline">
                  View Prompt Structure &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
